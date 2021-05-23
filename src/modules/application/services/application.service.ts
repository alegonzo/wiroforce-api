import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MinioClientService } from '../../../common/clients/minio.client.service';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { UpdateApplicationDto } from '../dto/update-application.dto';
import { Application } from '../entities/application.entity';
import * as Str from '@supercharge/strings';
import { CompanyService } from '../../company/services/company.service';
import { Company } from '../../company/entities/company.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    private companyService: CompanyService,
    private minioClient: MinioClientService,
    private configService: ConfigService
  ) { }

  async create(createApplicationDto: CreateApplicationDto, file: Express.Multer.File, company: Company): Promise<Application> {
    let token = Str.random();
    token = Str(token).replaceAll("-", "").get();
    let companyName = Str(company.name).replaceAll("-", "").replaceAll(" ", "").replaceAll("", "").lower().get();
    let appStringId = Str(createApplicationDto.name).replaceAll("-", "").replaceAll(" ", "").replaceAll("", "").lower().get();
    let appId = companyName + "_" + appStringId;
    const checkApp = await this.applicationRepository.findOne({ where: { appId: appId } });
    if (checkApp) {
      throw new BadRequestException({
        code: 400,
        message: 'La aplicacion ya existe'
      });
    }
    const application = new Application({
      name: createApplicationDto.name,
      token: token,
      appId: appId,
      company: await this.companyService.findOne(company.id),
      imageUrl: `apps/${appId}.png`,
      active: true
    });

    await this.minioClient.uploadFileBuffer(application.imageUrl, file.buffer);
    return this.applicationRepository.save(application);
  }

  findAll(companyId: number): Promise<Application[]> {
    return this.applicationRepository.find({ where: { companyId: companyId } });
  }

  findOneById(id: number): Promise<Application> {
    return this.applicationRepository.findOne(id);
  }

  async findOneByAppId(appId: string): Promise<Application> {
    const application = await this.applicationRepository.findOne({ where: { appId: appId } });
    if (application) {
      application.imageUrl = `http://${this.configService.get<string>('MINIO_URL')}` +
        `:${this.configService.get<string>('MINIO_PORT')}` +
        `/${this.configService.get<string>('DEFAULT_BUCKET')}` +
        `/${application.imageUrl}`;
    }
    return application;
  }

  findOneByToken(token: string): Promise<Application> {
    return this.applicationRepository.findOne({ where: { token: token } });
  }

  update(id: number, updateApplicationDto: UpdateApplicationDto) {
    return `This action updates a #${id} application`;
  }
}

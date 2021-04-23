import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MinioClientService } from '../../../common/clients/minio.client.service';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { UpdateApplicationDto } from '../dto/update-application.dto';
import { Application } from '../entities/application.entity';
import * as Str from '@supercharge/strings';
import { CompanyService } from '../../company/services/company.service';
import { Company } from '../../company/entities/company.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    private companyService: CompanyService,
    private minioClient: MinioClientService
  ) { }

  async create(createApplicationDto: CreateApplicationDto, file: Express.Multer.File, company: Company): Promise<Application> {
    let token = Str.random();
    token = Str(token).replaceAll("-", "").get();
    let companyName = Str(company.name).replaceAll("-", "").replaceAll(" ", "").replaceAll("", "").lower().get();
    let appStringId = Str(createApplicationDto.name).replaceAll("-", "").replaceAll(" ", "").replaceAll("", "").lower().get();
    let appId = companyName + "_" + appStringId;

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

  findOneByAppId(appId: string): Promise<Application> {
    return this.applicationRepository.findOne({ where: { appId: appId } });
  }

  update(id: number, updateApplicationDto: UpdateApplicationDto) {
    return `This action updates a #${id} application`;
  }

  remove(id: number) {
    return `This action removes a #${id} application`;
  }
}

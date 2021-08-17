import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { MinioClientService } from '../../../common/clients/minio.client.service';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { UpdateApplicationDto } from '../dto/update-application.dto';
import { QueryAllApplicationDto } from '../dto/query-all-application.dto';
import { Application } from '../entities/application.entity';
import * as Str from '@supercharge/strings';
import { CompanyService } from '../../company/services/company.service';
import { Company } from '../../company/entities/company.entity';
import { ConfigService } from '@nestjs/config';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    private companyService: CompanyService,
    private minioClient: MinioClientService,
    private configService: ConfigService,
  ) {}

  async create(
    createApplicationDto: CreateApplicationDto,
    file: Express.Multer.File,
    company: Company,
  ): Promise<Application> {
    let token = Str.random();
    token = Str(token).replaceAll('-', '').get();
    const companyName = Str(company.name)
      .replaceAll('-', '')
      .replaceAll(' ', '')
      .replaceAll('', '')
      .lower()
      .get();
    const appStringId = Str(createApplicationDto.name)
      .replaceAll('-', '')
      .replaceAll(' ', '')
      .replaceAll('', '')
      .lower()
      .get();
    const appId = companyName + '_' + appStringId;
    const checkApp = await this.applicationRepository.findOne({
      where: { appId: appId },
    });

    if (checkApp) {
      throw new BadRequestException({
        code: 400,
        message: 'La aplicacion ya existe',
      });
    }
    const application = new Application({
      name: createApplicationDto.name,
      token: token,
      appId: appId,
      company: await this.companyService.findOne(company.id),
      imageUrl: `apps/${appId}.png`,
      active: true,
    });

    await this.minioClient.uploadFileBuffer(application.imageUrl, file.buffer);
    return this.applicationRepository.save(application);
  }

  async findAll(query: QueryAllApplicationDto): Promise<PaginatedResponseDto> {
    const filters = {};
    if (query.search !== '')
      Object.assign(filters, { name: Like(`%${query.search}%`) });
    if (query.companyId !== '')
      Object.assign(filters, { companyId: query.companyId });
    const result = await this.applicationRepository.findAndCount({
      relations: ['company'],
      where: filters,
      skip: query.size * query.page,
      take: query.size,
      order: {
        id: 'DESC',
      },
    });

    return new PaginatedResponseDto({
      result: result[0],
      count: result[1],
    });
  }

  findAllByCompany(companyId: number): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { companyId: companyId, active: true },
    });
  }

  findOneById(id: number): Promise<Application> {
    return this.applicationRepository.findOne(id);
  }

  async findOneByAppId(appId: string): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { appId: appId },
    });
    if (application) {
      application.imageUrl =
        `https://${this.configService.get<string>('MINIO_URL')}` +
        `/${this.configService.get<string>('DEFAULT_BUCKET')}` +
        `/${application.imageUrl}`;
    }
    return application;
  }

  findOneByToken(token: string): Promise<Application> {
    return this.applicationRepository.findOne({ where: { token: token } });
  }

  async updateStatus(id: number, req): Promise<Application> {
    const application = await this.applicationRepository.findOne(id);
    if (
      req.user.roles === 'client' &&
      application?.companyId !== req.user.company.id
    ) {
      throw new ForbiddenException({
        status: 403,
        message: 'Forbidden',
      });
    }
    application.active = !application.active;
    return this.applicationRepository.save(application);
  }
}

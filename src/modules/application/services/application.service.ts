import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { MinioClientService } from '../../../common/clients/minio.client.service';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { QueryAllApplicationDto } from '../dto/query-all-application.dto';
import { Application } from '../entities/application.entity';
import * as Str from '@supercharge/strings';
import { CompanyService } from '../../company/services/company.service';
import { Company } from '../../company/entities/company.entity';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    private companyService: CompanyService,
    private minioClient: MinioClientService,
  ) {}

  async create(
    createApplicationDto: CreateApplicationDto,
    files: {
      image?: Express.Multer.File[];
      receipt?: Express.Multer.File[];
    },
    company: Company,
  ): Promise<Application> {
    const appsCount = await this.applicationRepository.findAndCount({
      where: {
        active: true,
        companyId: company.id,
      },
    });
    console.log(appsCount);
    const isPaid = appsCount[1] >= 2 && company.name !== 'Conwiro';

    if (isPaid && !files.receipt) {
      throw new BadRequestException({
        code: 400,
        message: 'Debe subir el recibo de pago',
      });
    }
    if (!files.image) {
      throw new BadRequestException({
        code: 400,
        message: 'Debe subir el icono de la aplicación',
      });
    }

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
      paid: isPaid,
      company: await this.companyService.findOne(company.id),
      imageUrl: `apps/${appId}.png`,
      receiptUrl: isPaid ? `apps/${appId}_receipt.png` : null,
      active: isPaid ? false : true,
    });

    await this.minioClient.uploadFileBuffer(
      application.imageUrl,
      files.image[0].buffer,
    );
    if (isPaid) {
      await this.minioClient.uploadFileBufferToSecret(
        application.receiptUrl,
        files.receipt[0].buffer,
      );
    }
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
      application.imageUrl = this.minioClient.buildMinioFilesPublicUrl(
        application.imageUrl,
      );
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

  async downloadReceiptImage(appId: number) {
    const app = await this.applicationRepository.findOne(appId);
    return this.minioClient.downloadFileFromSecret(app.receiptUrl);
  }
}

import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MinioClientService } from '../../../common/clients/minio.client.service';
import { ApplicationService } from '../../application/services/application.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private applicationService: ApplicationService,
    private minioClient: MinioClientService,
    private configService: ConfigService
  ) { }

  async create(createProductDto: CreateProductDto, file: Express.Multer.File, companyId: number): Promise<Product> {
    const application = await this.applicationService.findOneByAppId(createProductDto.appId);
    if (application?.companyId !== companyId) {
      throw new ForbiddenException({
        status: 401,
        message: 'Forbidden'
      });
    }
    const productCheck = await this.productRepository.findOne({
      where: {
        itemId: createProductDto.itemId,
        applicationId: application.id
      }
    });
    if (productCheck) {
      throw new BadRequestException({
        status: 400,
        errors: {
          itemId: 'El producto ya existe en esta aplicacion'
        }
      });
    }
    const product = new Product({
      ...createProductDto,
      active: true,
      application: application,
      imageUrl: file ? `products/${application.appId}/${createProductDto.itemId}.png` : null,
      version: 1
    });
    if (file)
      await this.minioClient.uploadFileBuffer(product.imageUrl, file.buffer);
    return this.productRepository.save(product);
  }

  async findAll(appId: string, companyId: number): Promise<Product[]> {
    const app = await this.applicationService.findOneByAppId(appId);
    if (app?.companyId !== companyId) {
      throw new ForbiddenException({
        status: 401,
        message: 'Forbidden'
      });
    }
    return this.productRepository.find({ where: { applicationId: app.id } });
  }

  async findAllMobile(id: number): Promise<Product[]> {
    const products = await this.productRepository.find({ where: { applicationId: id } });
    return products.map(item => {
      if (item.imageUrl) {
        item.imageUrl = `https://${this.configService.get<string>('MINIO_URL')}` +
          `/${this.configService.get<string>('DEFAULT_BUCKET')}` +
          `/${item.imageUrl}`
      }
      return item;
    })
  }

  async findOne(id: number, companyId: number): Promise<Product> {
    const product = await this.productRepository.findOne(id, {
      relations: ['application']
    });
    if (product?.application.companyId !== companyId) {
      throw new ForbiddenException({
        status: 401,
        message: 'Forbidden'
      });
    }
    product.application = null;
    if (product.imageUrl) {
      product.imageUrl = `https://${this.configService.get<string>('MINIO_URL')}` +
        `/${this.configService.get<string>('DEFAULT_BUCKET')}` +
        `/${product.imageUrl}`;
    }
    return product;
  }

  findOneByItemId(itemId: string): Promise<Product> {
    return this.productRepository.findOne({ where: { itemId: itemId } });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    file: Express.Multer.File,
    companyId: number
  ): Promise<Product> {
    const product = await this.productRepository.findOne(id, { relations: ['application'] });
    if (product?.application.companyId !== companyId) {
      throw new ForbiddenException({
        status: 401,
        message: 'Forbidden'
      });
    }
    if (file) {
      product.imageUrl = `products/${product.application.appId}/${product.itemId}.png`
      await this.minioClient.uploadFileBuffer(product.imageUrl, file.buffer);
    }
    product.price = updateProductDto.price;
    product.description = updateProductDto.description;
    product.resourceAmount = updateProductDto.resourceAmount;
    product.active = updateProductDto.active;
    product.offline = updateProductDto.offline;
    product.version += 1;
    return this.productRepository.save(product);
  }
}

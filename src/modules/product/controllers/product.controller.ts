import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  Query,
  Put,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Product } from '../entities/product.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/enums/role.enum';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GetAllProductsQueryDto } from '../dto/get-all-products-query.dto';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';

@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Forbidden exception' })
@ApiTags('In-App-Purchase Products')
@UseGuards(JwtAuthGuard, RolesGuard, ThrottlerGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiCreatedResponse({ type: Product })
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: 300000,
      },
    }),
  )
  @Post()
  @Roles(Role.CLIENT)
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() req,
  ) {
    return this.productService.create(
      createProductDto,
      image,
      req.user.company.id,
    );
  }

  @ApiQuery({ required: true, name: 'appId' })
  @ApiOkResponse({ type: [Product] })
  @Get()
  @Roles(Role.CLIENT)
  findAll(
    @Query() query: GetAllProductsQueryDto,
    @Req() req,
  ): Promise<PaginatedResponseDto> {
    return this.productService.findAll(query, req.user.company.id);
  }

  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: Product })
  @Get(':id')
  @Roles(Role.CLIENT)
  findOne(@Param('id') id: number, @Req() req) {
    return this.productService.findOne(+id, req.user.company.id);
  }

  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: Product })
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: 300000,
      },
    }),
  )
  @Put(':id')
  @Roles(Role.CLIENT)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() req,
  ): Promise<Product> {
    return this.productService.update(
      +id,
      updateProductDto,
      image,
      req.user.company.id,
    );
  }
}

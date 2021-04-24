import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Req, Query, Put } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Product } from '../entities/product.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('In-App-Purchase Products')
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @ApiResponse({ status: 200, type: Product })
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() req) {
    return this.productService.create(createProductDto, image);
  }

  @ApiQuery({ required: true, name: 'appId' })
  @ApiResponse({ status: 200, type: [Product] })
  @Get()
  findAll(
    @Query('appId') appId: string,
    @Req() req) {
    return this.productService.findAll(appId);
  }

  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: Product })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productService.findOne(+id);
  }

  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: Product })
  @UseInterceptors(FileInterceptor('image'))
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() image: Express.Multer.File
  ): Promise<Product> {
    return this.productService.update(+id, updateProductDto, image);
  }
}

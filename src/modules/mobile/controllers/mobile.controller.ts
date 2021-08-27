import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ProductService } from '../../product/services/product.service';

@UseGuards(ThrottlerGuard)
@ApiTags('Mobile Integration')
@Controller('mobile')
export class MobileController {
  constructor(private productService: ProductService) {}

  @Get('products')
  async getProducts(@Req() req) {
    const products = await this.productService.findAllMobile(
      req.application.id,
    );
    return {
      iapProducts: products,
    };
  }
}

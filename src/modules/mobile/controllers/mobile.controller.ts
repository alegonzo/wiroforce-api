import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from '../../product/services/product.service';

@ApiTags('Mobile Integration')
@Controller('mobile')
export class MobileController {
    constructor(
        private productService: ProductService
    ) { }

    @Get('products')
    getProducts(@Req() req) {
        return this.productService.findAllMobile(req.application.id);
    }
}

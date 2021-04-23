import { Controller, Get, Req } from '@nestjs/common';
import { ProductService } from '../../product/services/product.service';

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

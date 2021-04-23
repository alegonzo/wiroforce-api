import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { ProductModule } from '../product/product.module';
import { MobileController } from './controllers/mobile.controller';
import { MobileAuthMiddleware } from './middlewares/mobile-auth.middleware';

@Module({
    imports: [ApplicationModule, ProductModule],
    controllers: [MobileController]
})
export class MobileModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(MobileAuthMiddleware)
            .forRoutes("mobile");
    }
}

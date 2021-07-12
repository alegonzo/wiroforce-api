import { Controller, Get, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Throttle(10, 360)
@Controller('live')
export class LiveController {

    @Get()
    checkLive() {
        return true;
    }
}

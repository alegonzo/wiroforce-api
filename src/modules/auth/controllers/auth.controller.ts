import { Controller, Body, Post, UseGuards, Request } from '@nestjs/common';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return await this.authService.login(req.user);
    }

    @Post('signup')
    async signUp(@Body() createUserDto: CreateUserDto) {
        return await this.authService.create(createUserDto);
    }
}
import {
  Controller,
  Body,
  Post,
  UseGuards,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
  Put,
  Req,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CreateAdminDto } from '../../user/dto/create-admin.dto';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { Roles } from '../decorators/roles.decorator';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { Role } from '../enums/role.enum';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AuthService } from '../services/auth.service';

@ApiTags('Authentication')
@UseGuards(ThrottlerGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOkResponse()
  @ApiForbiddenResponse()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @ApiCreatedResponse()
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.create(createUserDto);
  }

  @Post('createAdmin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  createAdmin(@Body() body: CreateAdminDto) {
    return this.authService.createAdmin(body);
  }

  @Put('changePassword')
  @UseGuards(JwtAuthGuard)
  changePassword(@Req() req, @Body() body: ChangePasswordDto) {
    return this.authService.changePassword(req.user.email, body);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put, Query, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiBearerAuth, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/enums/role.enum';
import { GetAllQueryDto } from '../dto/get-all-query.dto';
import { User } from '../entities/user.entity';
import { CreateAdminDto } from '../dto/create-admin.dto';

@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Forbidden Exception' })
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @Roles(Role.ADMIN)
  findAll(@Query() queryDto: GetAllQueryDto): Promise<User[]> {
    return this.userService.findAll(queryDto);
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/profile')
  @Roles(Role.ADMIN, Role.CLIENT)
  findProfile(@Req() req) {
    return this.userService.findOneById(req.user.id);
  }

  @Put('/editProfile')
  @Roles(Role.ADMIN, Role.CLIENT)
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Put(':id/updateStatus')
  @Roles(Role.ADMIN)
  updateStatus(@Param('id') id: string) {
    return this.userService.updateStatus(+id);
  }

}

import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/enums/role.enum';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CompanyService } from '../services/company.service';
import { Company } from '../entities/company.entity';

@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Forbidden Exception' })
@ApiTags('Estudios')
@UseGuards(JwtAuthGuard, RolesGuard, ThrottlerGuard)
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @ApiOkResponse({ type: [Company] })
  @Get()
  @Roles(Role.ADMIN)
  findAll(@Req() req): Promise<any> {
    return this.companyService.findAll();
  }
}

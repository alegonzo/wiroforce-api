import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  ForbiddenException,
  Query,
  Put,
  UploadedFiles,
  Res,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { ApplicationService } from '../services/application.service';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { Application } from '../entities/application.entity';
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
import { QueryAllApplicationDto } from '../dto/query-all-application.dto';

@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Forbidden Exception' })
@ApiTags('Applications')
@UseGuards(JwtAuthGuard, RolesGuard, ThrottlerGuard)
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @ApiCreatedResponse({ type: Application })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'receipt', maxCount: 1 },
      ],
      {
        limits: {
          fieldSize: 10485760,
        },
      },
    ),
  )
  @Post()
  @Roles(Role.CLIENT)
  create(
    @Body() createApplicationDto: CreateApplicationDto,
    @UploadedFiles()
    files,
    @Req() req,
  ) {
    return this.applicationService.create(
      createApplicationDto,
      files,
      req.user.company,
    );
  }

  @ApiOkResponse({ type: [Application] })
  @Get()
  @Roles(Role.CLIENT, Role.ADMIN)
  findAll(@Req() req, @Query() query: QueryAllApplicationDto): Promise<any> {
    if (req.user.roles === 'admin') {
      return this.applicationService.findAll(query);
    } else {
      return this.applicationService.findAllByCompany(req.user.company.id);
    }
  }

  @ApiOkResponse({ type: Application })
  @Get(':id')
  @Roles(Role.CLIENT)
  async findOne(@Param('id') id: string, @Req() req): Promise<Application> {
    const application = await this.applicationService.findOneByAppId(id);
    if (application?.companyId !== req.user.company.id)
      throw new ForbiddenException({
        status: 401,
        message: 'Forbidden',
      });
    return application;
  }

  @ApiOkResponse({ type: Application })
  @Put(':id/updateStatus')
  @Roles(Role.CLIENT, Role.ADMIN)
  updateStatus(@Param('id') id: number, @Req() req): Promise<Application> {
    return this.applicationService.updateStatus(id, req);
  }

  @ApiOkResponse()
  @Get(':id/receipt')
  @Roles(Role.ADMIN)
  async findOneReceipt(@Param('id') id: number, @Res() res): Promise<any> {
    return (await this.applicationService.downloadReceiptImage(id)).pipe(res);
  }
}

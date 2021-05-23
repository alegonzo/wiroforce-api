import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile, UseGuards, Req, UseFilters, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApplicationService } from '../services/application.service';
import { CreateApplicationDto } from '../dto/create-application.dto';
//import { UpdateApplicationDto } from '../dto/update-application.dto';
import { Application } from '../entities/application.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BaseExceptionFilter } from '@nestjs/core';

@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Forbidden Exception' })
@ApiTags('Applications')
@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) { }

  @ApiCreatedResponse({ type: Application })
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  create(
    @Body() createApplicationDto: CreateApplicationDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() req) {
    return this.applicationService.create(createApplicationDto, image, req.user.company);
  }

  @ApiOkResponse({ type: [Application] })
  @Get()
  findAll(@Req() req): Promise<Application[]> {
    return this.applicationService.findAll(req.user.company.id);
  }

  @ApiOkResponse({ type: Application })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Application> {
    return this.applicationService.findOneByAppId(id);
  }

  /*@Patch(':id')
  update(@Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto) {
    return this.applicationService.update(+id, updateApplicationDto);
  }*/
}

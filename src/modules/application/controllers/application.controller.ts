import { Controller, Get, Post, Body, Patch, Param, UseInterceptors, UploadedFile, UseGuards, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApplicationService } from '../services/application.service';
import { CreateApplicationDto } from '../dto/create-application.dto';
//import { UpdateApplicationDto } from '../dto/update-application.dto';
import { Application } from '../entities/application.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) { }

  @UseInterceptors(FileInterceptor('image'))
  @Post()
  create(
    @Body() createApplicationDto: CreateApplicationDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() req) {
    return this.applicationService.create(createApplicationDto, image, req.user.company);
  }

  @Get()
  findAll(@Req() req): Promise<Application[]> {
    return this.applicationService.findAll(req.user.company.id);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Application> {
    return this.applicationService.findOneById(+id);
  }

  /*@Patch(':id')
  update(@Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto) {
    return this.applicationService.update(+id, updateApplicationDto);
  }*/
}

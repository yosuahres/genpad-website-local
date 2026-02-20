// apps/api/src/academic-years/academic-years.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AcademicYearsService } from './academic-years.service';
import { CreateAcademicYearDto, UpdateAcademicYearDto } from '../dto/academicyears.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('academic-years')
@UseGuards(AuthGuard)
export class AcademicYearsController {
  constructor(private readonly service: AcademicYearsService) {}

  @Get()
  findAll(@Query('page', new ParseIntPipe({optional: true})) page = 1) {
    return this.service.findAll(page);
  }

  @Post()
  create(@Body() dto: CreateAcademicYearDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAcademicYearDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
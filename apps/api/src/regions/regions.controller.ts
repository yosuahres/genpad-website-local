import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { CreateRegionDto, UpdateRegionDto } from '../dto/region.dto';
import { JwtAuthGuard } from '../auth.guard';

@Controller('regions')
@UseGuards(JwtAuthGuard) // Protect routes with your existing JWT guard
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.regionsService.findAll(page, limit);
  }

  @Post()
  create(@Body() dto: CreateRegionDto) {
    return this.regionsService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRegionDto) {
    return this.regionsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.regionsService.remove(id);
  }
}
// apps/api/src/parent-asuh/parent-asuh.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ParentAsuhService } from './parent-asuh.service';
import { CreateParentAsuhDto, UpdateParentAsuhDto } from '../dto/parent-asuh.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('parent-asuh')
@UseGuards(AuthGuard)
export class ParentAsuhController {
  constructor(private readonly service: ParentAsuhService) {}

  @Get()
  findAll(@Query('page', new ParseIntPipe({optional: true})) page = 1) {
    return this.service.findAll(page);
  }

  @Post()
  create(@Body() dto: CreateParentAsuhDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateParentAsuhDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
// apps/api/src/children/children.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ChildrenService } from './children.service';
import { CreateChildDto, UpdateChildDto } from '../dto/children.dto';
import { AuthGuard } from '../auth.guard';

@Controller('children')
@UseGuards(AuthGuard)
export class ChildrenController {
  constructor(private readonly service: ChildrenService) {}

  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
  ) {
    // Uses the extended method defined in children.service.ts to join names
    return this.service.findAllExtended(page, limit);
  }

  @Post()
  async create(@Body() dto: CreateChildDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateChildDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
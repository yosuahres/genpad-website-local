// apps/api/src/template-cards/template-cards.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  ParseIntPipe 
} from '@nestjs/common';
import { TemplateCardsService } from './template-cards.service';
import { CreateTemplateCardDto, UpdateTemplateCardDto } from '../dto/template-card.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('template-cards')
@UseGuards(AuthGuard) 
export class TemplateCardsController {
  constructor(private readonly service: TemplateCardsService) {}

  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
  ) {
    return this.service.findAll(page, limit);
  }

  @Post()
  async create(@Body() dto: CreateTemplateCardDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string, 
    @Body() dto: UpdateTemplateCardDto
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
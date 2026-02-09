import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('documents')
@UseGuards(AuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    return this.documentsService.findAllExtended(+page || 1, +limit || 10);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOneExtended(id);
  }
}
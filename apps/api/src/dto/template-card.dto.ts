// apps/api/src/dto/template-card.dto.ts
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateTemplateCardDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  template_type?: string; // Should match your DB enum values like 'card_template'

  @IsString()
  @IsOptional()
  template_file?: string;

  @IsString()
  @IsOptional()
  default_message?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class UpdateTemplateCardDto extends PartialType(CreateTemplateCardDto) {}
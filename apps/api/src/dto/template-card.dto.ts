import { IsString, IsNotEmpty, IsBoolean, IsEnum } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export enum TemplateType {
  STUDENT = 'STUDENT',
  STAFF = 'STAFF',
  VISITOR = 'VISITOR'
}

export class CreateTemplateCardDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(TemplateType)
  template_type: TemplateType;

  @IsString()
  @IsNotEmpty()
  template_file: string; // Path or URL to the template asset

  @IsBoolean()
  is_active: boolean;
}

export class UpdateTemplateCardDto extends PartialType(CreateTemplateCardDto) {}
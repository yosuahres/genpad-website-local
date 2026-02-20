// apps/api/src/dto/children.dto.ts
import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateChildDto {
  @IsString()
  @IsNotEmpty()
  child_code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @IsNotEmpty()
  region_id: string;

  @IsString()
  @IsNotEmpty()
  education_level: string;

  @IsUUID()
  @IsNotEmpty()
  academic_year_id: string;

  @IsUUID()
  @IsOptional()
  parent_asuh_id?: string; 

  @IsUUID()
  @IsOptional()
  created_by?: string;
}

export class UpdateChildDto extends PartialType(CreateChildDto) {}
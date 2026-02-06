// apps/api/src/dto/academic-year.dto.ts
import { IsString, IsNotEmpty, IsBoolean, Matches } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateAcademicYearDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}\/\d{4}$/, { message: 'Year label must be in format YYYY/YYYY' })
  year_label: string;

  @IsBoolean()
  is_active: boolean;
}

export class UpdateAcademicYearDto extends PartialType(CreateAcademicYearDto) {}
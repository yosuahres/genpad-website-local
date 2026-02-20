import { IsString, IsNotEmpty, IsUppercase, Length } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateRegionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  @Length(2, 5)
  code: string; // Enforcing code standards (e.g., "US", "ID-JK")
}

export class UpdateRegionDto extends PartialType(CreateRegionDto) {}
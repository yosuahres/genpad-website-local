// apps/api/src/dto/parent-asuh.dto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateParentAsuhDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  phone_number?: string;

  @IsString()
  @IsOptional()
  address?: string;
}

export class UpdateParentAsuhDto extends PartialType(CreateParentAsuhDto) {}
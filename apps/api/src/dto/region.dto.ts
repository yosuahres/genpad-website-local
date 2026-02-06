import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRegionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}

export class UpdateRegionDto extends CreateRegionDto {}
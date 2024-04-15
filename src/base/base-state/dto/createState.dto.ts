import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBaseStateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  countryId: string;

  @IsString()
  @IsNotEmpty()
  iso2: string;

  @IsBoolean()
  @IsOptional()
  status: boolean;
}

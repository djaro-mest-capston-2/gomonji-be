import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  iso2: string;

  @IsString()
  @IsNotEmpty()
  iso3: string;

  @IsString()
  @IsNotEmpty()
  isoNumeric: string;

  @IsString()
  @IsNotEmpty()
  phoneCode: string;

  @IsString()
  @IsOptional()
  continent: string;

  @IsString()
  @IsNotEmpty()
  capital: string;

  @IsString()
  @IsNotEmpty()
  timeZone: string;

  @IsString()
  @IsOptional()
  languageCodes: string;

  @IsBoolean()
  @IsOptional()
  status: boolean;
}

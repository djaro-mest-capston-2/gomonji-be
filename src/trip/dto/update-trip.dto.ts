import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { CurrencyEnum, TripCategoryEnum } from '../interface';

export class UpdateTripDto {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  destination?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  price?: string;

  @IsEnum(CurrencyEnum)
  @IsOptional()
  currency?: CurrencyEnum;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TripCategoryEnum)
  @IsOptional()
  category?: TripCategoryEnum;

  @IsDate()
  @IsOptional()
  tripStarts?: Date;

  @IsDate()
  @IsOptional()
  tripEnds?: Date;

  @IsString({ each: true })
  @IsOptional()
  itinaryNames?: string[];

  @IsString()
  @IsOptional()
  itinaryLocations?: string;

  @IsString({ each: true })
  @IsOptional()
  urls?: string[];
}

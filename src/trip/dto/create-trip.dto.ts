import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { CurrencyEnum, TripCategoryEnum } from '../interface';

export class CreateTripDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsString()
  destination: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  price: string;

  @IsOptional()
  @IsEnum(CurrencyEnum)
  currency?: CurrencyEnum;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TripCategoryEnum)
  category: TripCategoryEnum;

  @IsOptional()
  @IsDate()
  tripStarts?: Date;

  @IsOptional()
  @IsDate()
  tripEnds?: Date;

  @IsOptional()
  @IsString()
  itinaryNames?: string[];

  @IsOptional()
  @IsString()
  itinaryLocations?: string;

  @IsOptional()
  @IsString()
  urls?: string[];
}

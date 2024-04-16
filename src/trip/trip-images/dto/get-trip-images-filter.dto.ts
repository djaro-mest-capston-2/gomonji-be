import { PaginationSearchOptionsDto } from '../../../common/interfaces/pagination-search-options.dto';
import { Type } from 'class-transformer';
import {
  IsBooleanString,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export enum TripsImagesOrderColumns {
  CreatedAt = 'createdAt',
  Name = 'name',
}

export const MapTripImagesOrderByToValue = {
  createdAt: 'createdAt',
  name: 'name',
};

export class GetTripImagesFilterDto extends PaginationSearchOptionsDto {
  @IsOptional()
  @IsString()
  tripId?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsBooleanString()
  status?: boolean;

  @IsEnum(TripsImagesOrderColumns)
  @IsOptional()
  orderBy?: TripsImagesOrderColumns;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;
}

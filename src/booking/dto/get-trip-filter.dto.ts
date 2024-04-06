import { PaginationSearchOptionsDto } from '../../common/interfaces/pagination-search-options.dto';
import { Type } from 'class-transformer';
import {
  IsBooleanString,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export enum TripsOrderColumns {
  CreatedAt = 'createdAt',
  Name = 'name',
}

export const MapTripOrderByToValue = {
  createdAt: 'createdAt',
  name: 'name',
};
export class GetTripsFilterDto extends PaginationSearchOptionsDto {
  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  price?: string;

  @IsOptional()
  @IsString()
  itinaryName?: string;

  @IsOptional()
  @IsBooleanString()
  status?: boolean;

  @IsEnum(TripsOrderColumns)
  @IsOptional()
  orderBy?: TripsOrderColumns;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;
}

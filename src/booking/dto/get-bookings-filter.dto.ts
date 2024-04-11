import { PaginationSearchOptionsDto } from '../../common/interfaces/pagination-search-options.dto';
import { Type } from 'class-transformer';
import {
  IsBooleanString,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export enum BookingsOrderColumns {
  CreatedAt = 'createdAt',
  Name = 'name',
}

export const MapBookingOrderByToValue = {
  createdAt: 'createdAt',
  name: 'name',
};
export class GetBookingsFilterDto extends PaginationSearchOptionsDto {
  @IsOptional()
  @IsString()
  tripId?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNo?: string;

  @IsOptional()
  @IsBooleanString()
  status?: boolean;

  @IsEnum(BookingsOrderColumns)
  @IsOptional()
  orderBy?: BookingsOrderColumns;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;
}

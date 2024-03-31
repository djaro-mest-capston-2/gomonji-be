import { PaginationSearchOptionsDto } from '../../common/interfaces/pagination-search-options.dto';
import { Type } from 'class-transformer';
import {
  IsBooleanString,
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
} from 'class-validator';

export enum UsersOrderColumns {
  CreatedAt = 'createdAt',
  Name = 'name',
}

export const MapUserOrderByToValue = {
  createdAt: 'createdAt',
  name: 'name',
};
export class GetUsersFilterDto extends PaginationSearchOptionsDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsBooleanString()
  status?: boolean;

  @IsEnum(UsersOrderColumns)
  @IsOptional()
  orderBy?: UsersOrderColumns;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;
}

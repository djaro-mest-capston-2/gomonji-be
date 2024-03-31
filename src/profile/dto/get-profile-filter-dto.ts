import { PaginationSearchOptionsDto } from '../../common/interfaces/pagination-search-options.dto';
import { Type } from 'class-transformer';
import {
  IsBooleanString,
  IsDate,
  IsEnum,
  IsOptional,
} from 'class-validator';

export enum ProfilesOrderColumns {
  CreatedAt = 'createdAt',
  Name = 'name',
}

export const MapProfileOrderByToValue = {
  createdAt: 'createdAt',
  name: 'name',
};
export class GetProfilesFilterDto extends PaginationSearchOptionsDto {
  @IsOptional()
  @IsBooleanString()
  status?: boolean;

  @IsEnum(ProfilesOrderColumns)
  @IsOptional()
  orderBy?: ProfilesOrderColumns;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;
}

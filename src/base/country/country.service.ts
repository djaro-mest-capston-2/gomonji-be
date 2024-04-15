import { Prisma as Prisma, PrismaClient as PrismaClient } from '@prisma/client';
import { CrudService } from '../../common/database/crud.service';
import { PaginationSearchOptionsDto } from '../../common/interfaces/pagination-search-options.dto';
import { Injectable } from '@nestjs/common';
import { CountryMapType } from './country.maptype';

@Injectable()
export class CountryService extends CrudService<
  Prisma.CountryDelegate,
  CountryMapType
> {
  constructor(private prismaClient: PrismaClient) {
    super(prismaClient.country);
  }

  getCountries(dto: PaginationSearchOptionsDto) {
    const parsedQueryFilters = this.parseQueryFilter(dto, [
      'name',
      'iso2',
      'iso3',
      'continent',
      'timeZone',
    ]);
    const args: Prisma.CountryFindManyArgs = {
      where: parsedQueryFilters,
    };
    dto.orderBy = 'name';

    return this.findManyPaginate(args, dto);
  }
}

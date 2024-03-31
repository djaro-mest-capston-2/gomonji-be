import { RequestWithUser } from '../auth/interfaces';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma as Prisma, PrismaClient as PrismaClient } from '@prisma/client';
import { CrudService } from '../common/database/crud.service';
import moment from 'moment';
import { AppUtilities } from '../app.utilities';
import { TripMapType } from './trip-mapetype';
import {
  GetTripsFilterDto,
  MapTripOrderByToValue,
} from './dto/get-trip-filter-dto';
import { CreateTripDto } from './dto/create-trip-dto';

@Injectable()
export class TripService extends CrudService<Prisma.TripDelegate, TripMapType> {
  constructor(private prisma: PrismaClient) {
    super(prisma.trip);
  }

  async getTrips(
    { page, size, orderBy, cursor, direction, ...filters }: GetTripsFilterDto,
    req: RequestWithUser,
  ) {
    const parseSplittedTermsQuery = (term: string) => {
      const parts = term.trim().split(/\s+/);
      if (parts.length > 0) {
        return {
          name: { in: parts, mode: 'insensitive' },
        };
      }
      return undefined;
    };

    const parsedQueryFilters = this.parseQueryFilter(filters, [
      {
        key: 'term',
        where: parseSplittedTermsQuery,
      },
      {
        key: 'startDate',
        where: (startDate, filterDto) => {
          const mStartDate = moment
            .parseZone(filterDto.startDate)
            .startOf('day')
            .toDate();
          return {
            createdAt: {
              gte: mStartDate,
              ...(!filterDto.endDate && {
                lte: moment
                  .parseZone(filterDto.startDate)
                  .endOf('day')
                  .toDate(),
              }),
            },
          };
        },
      },
      {
        key: 'endDate',
        where: (endDate, filterDto) => {
          const mEndDate = moment
            .parseZone(filterDto.endDate)
            .endOf('day')
            .toDate();
          return {
            createdAt: {
              lte: mEndDate,
              ...(!filterDto.startDate && {
                gte: moment
                  .parseZone(filterDto.endDate)
                  .startOf('day')
                  .toDate(),
              }),
            },
          };
        },
      },
      {
        key: 'status',
        where: (value: string) => {
          return { status: value === 'true' };
        },
      },
    ]);

    const args: Prisma.TripFindManyArgs = {
      where: {
        ...parsedQueryFilters,
      },
      include: {
        address: true,
        itenary: true,
        tripPhotos: true,
        user: true,
      },
    };

    return this.findManyPaginate(args, {
      page,
      size,
      cursor,
      direction,
      orderBy:
        orderBy &&
        AppUtilities.unflatten({
          [MapTripOrderByToValue[orderBy]]: direction,
        }),
    });
  }

  async createTrip({
    userId,
    title,
    destination,
    description,
    price,
    currency,
    itinaryNames,
    ...items
  }: CreateTripDto, Req: RequestWithUser) {
    return this.prisma.trip.create({
      data: {
        ...items,
        destination,
        title,
        description,
        price,
        currency,
        itenary: {
          create: itinaryNames.map((name) => ({
            name,
          })),
        },
        tripEnds: new Date(),
        tripStarts: new Date(),
        user: {
          connect: {
            id: userId,
          },
        },
        createdAt: new Date(),
      },
    });
  }
}

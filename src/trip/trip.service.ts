import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Prisma as Prisma,
  PrismaClient as PrismaClient,
  User,
} from '@prisma/client';
import { CrudService } from '../common/database/crud.service';
import moment from 'moment';
import { AppUtilities } from '../app.utilities';
import { TripMapType } from './trip-mapetype';
import {
  GetTripsFilterDto,
  MapTripOrderByToValue,
} from './dto/get-trip-filter.dto';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Injectable()
export class TripService extends CrudService<Prisma.TripDelegate, TripMapType> {
  constructor(private prisma: PrismaClient) {
    super(prisma.trip);
  }

  async getAll(
    { page, size, orderBy, cursor, direction, ...filters }: GetTripsFilterDto,
    req: User,
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
        itinerary: true,
        tripPhotos: true,
        user: { include: { profile: true } },
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

  async createTrip(
    {
      userId,
      title,
      destination,
      description,
      price,
      currency,
      category,
      tripStarts,
      tripEnds,
    }: CreateTripDto,
    Req: User,
  ) {
    return this.prisma.trip.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        destination,
        title,
        description,
        ...(price && { price }),
        ...(currency && { currency }),
        tripEnds: tripEnds || new Date(),
        tripStarts: tripStarts || new Date(),
        ...(category && { category }),
        createdAt: new Date(),
      },
    });
  }

  async updateTrip(authUser: User, id: string, dto: UpdateTripDto) {
    const args: Prisma.TripUpdateArgs = {
      where: { id },
      data: {
        ...dto,
        updatedBy: authUser.id,
      },
    };
    return this.update(args);
  }

  async cancelTrip(id: string) {
    const sample = await this.findFirst({
      where: { id },
    });
    if (!sample) {
      throw new NotFoundException('Trip not found!');
    }
    return this.update({
      where: { id },
      data: {
        status: false,
      },
    });
  }
}

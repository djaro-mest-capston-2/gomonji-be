import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Prisma as Prisma,
  PrismaClient as PrismaClient,
  User,
} from '@prisma/client';
import { CrudService } from '../../common/database/crud.service';
import moment from 'moment';
import { AppUtilities } from '../../app.utilities';
import { TripImagesMapType } from './trip-images-mapetype';
import { GetTripImagesFilterDto, MapTripImagesOrderByToValue } from './dto/get-trip-images-filter.dto';
import { CreateTripImagesDto } from './dto/create-trip-images.dto';
import { UpdateTripImagesDto } from './dto/update-trip-images.dto';

@Injectable()
export class TripImagesService extends CrudService<Prisma.TripImagesDelegate, TripImagesMapType> {
  constructor(private prisma: PrismaClient) {
    super(prisma.tripImages);
  }

  async getAll(
    { page, size, orderBy, cursor, direction, ...filters }: GetTripImagesFilterDto,
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

    const args: Prisma.TripImagesFindManyArgs = {
      where: {
        ...parsedQueryFilters,
      },
      include: {
        trip: { include: { user: true } },
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
          [MapTripImagesOrderByToValue[orderBy]]: direction,
        }),
    });
  }

  async createTripImages(
    {
      tripId,
      urls,
    }: CreateTripImagesDto,
    Req: User,
  ) {
    return this.prisma.tripImages.createMany({
      data: urls.map((url) => ({
        tripId,
        url,
        createdBy: Req.id,
      })),
      });
  }

  async updateTripImages(authUser: User, id: string, dto: UpdateTripImagesDto) {
    const args: Prisma.TripImagesUpdateManyArgs = {
      where: { id },
      data: dto.urls.map(url => ({
        url,
        updatedBy: authUser.id,
      })),
    };
    return this.updateMany(args);
  }

  async cancelTripImage(id: string) {
    const image = await this.findFirst({
      where: { id },
    });
    if (!image) {
      throw new NotFoundException('Image not found!');
    }
    return this.update({
      where: { id },
      data: {
        status: false,
      },
    });
  }
}

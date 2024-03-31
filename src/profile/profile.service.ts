import { Injectable } from '@nestjs/common';
import { Prisma as Prisma, PrismaClient as PrismaClient, User } from '@prisma/client';
import { CrudService } from '../common/database/crud.service';
import moment from 'moment';
import { AppUtilities } from '../app.utilities';
import { ProfileMapType } from './profile-mapetype';
import {
  GetProfilesFilterDto,
  MapProfileOrderByToValue,
} from './dto/get-profile-filter-dto';
import { CreateProfileDto } from './dto/create-profile-dto';

@Injectable()
export class ProfileService extends CrudService<Prisma.ProfileDelegate, ProfileMapType> {
  constructor(private prisma: PrismaClient) {
    super(prisma.profile);
  }

  async getAll(
    { page, size, orderBy, cursor, direction, ...filters }: GetProfilesFilterDto,
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

    const args: Prisma.ProfileFindManyArgs = {
      where: {
        ...parsedQueryFilters,
      },
      include: {
        user: true,
        country: true,
        state: true,
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
          [MapProfileOrderByToValue[orderBy]]: direction,
        }),
    });
  }

  async createProfile({
    userId,
    countryId,
    stateId,
    firstName,
    lastName,
    ...items
  }: CreateProfileDto, Req: User) {
    return this.prisma.profile.create({
      data: {
        ...items,
        firstName,
        lastName,
        user: {
          connect: {
            id: userId,
          },
        },
        country: countryId
          ? {
              connect: {
                id: countryId,
              },
            }
          : undefined,
        state: stateId
          ? {
              connect: {
                id: stateId,
              },
            }
          : undefined,
      
        createdAt: new Date(),
      },
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Prisma as Prisma,
  PrismaClient as PrismaClient,
  User,
} from '@prisma/client';
import { CrudService } from '../common/database/crud.service';
import moment from 'moment';
import { AppUtilities } from '../app.utilities';
import {
  GetUsersFilterDto,
  MapUserOrderByToValue,
} from './dto/get-user-filter.dto';
import { UserMapType } from './user.mapetype';

@Injectable()
export class UserService extends CrudService<Prisma.UserDelegate, UserMapType> {
  constructor(private prismaClient: PrismaClient) {
    super(prismaClient.user);
  }

  async getAll(
    { page, size, orderBy, cursor, direction, ...filters }: GetUsersFilterDto,
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

    const args: Prisma.UserFindManyArgs = {
      where: {
        ...parsedQueryFilters,
      },
      include: {
        profile: true,
        trips: true,
        address: true,
        billing: true,
        role: true,
        photos: true,
        Transaction: true,
        socialMedia: true,
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
          [MapUserOrderByToValue[orderBy]]: direction,
        }),
    });
  }

  async getOne(id: string, req: User) {
    const dto: Prisma.UserFindFirstArgs = {
      where: { id },
      include: {
        profile: true,
        trips: true,
        address: true,
        billing: true,
        role: true,
        photos: true,
        Transaction: true,
        socialMedia: true,
      },
    };
    return await this.findFirstOrThrow(dto);
  }

  async archiveUser(id: string) {
    const user = await this.findFirstOrThrow({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return this.update({
      where: { id },
      data: {
        status: false,
      },
    });
  }
}

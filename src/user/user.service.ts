import { RequestWithUser } from '../auth/interfaces';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma as Prisma, PrismaClient as PrismaClient } from '@prisma/client';
import { CrudService } from '../common/database/crud.service';
import moment from 'moment';
import bcrypt from 'bcryptjs';
import { AppUtilities } from '../app.utilities';
import { UserMapType } from './user-mapeType';
import {
  GetUsersFilterDto,
  MapUserOrderByToValue,
} from './dto/get-user-filter-dto';
import { CreateUserDto } from './dto/create-user-dto';

@Injectable()
export class UserService extends CrudService<
  Prisma.UserDelegate, UserMapType
> {
  constructor(private prismaClient: PrismaClient) {
    super(prismaClient.user);
  }

  async getUsers(
    { page, size, orderBy, cursor, direction, ...filters }: GetUsersFilterDto,
    req: RequestWithUser,
  ) {
    const parseSplittedTermsQuery = (term: string) => {
      const parts = term.trim().split(/\s+/);
      if (parts.length > 0) {
        return {
          service: {
            name: { in: parts, mode: 'insensitive' },
          },
        };
      }
      return undefined;
    };

    const parsedQueryFilters = this.parseQueryFilter(filters, [
      'name|equals',
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

  async createUser({ email, password }: CreateUserDto) {
    const salt: string = bcrypt.genSaltSync(10);
    const hash: string = bcrypt.hashSync(password, salt);
    return this.create({
      data: {
        email,
        password: hash,
      },
    });
  }

  // async updateUser(
  //   authUser: RequestWithUser,
  //   id: string,
  //   dto: UpdateUserDto,
  // ) {
  //   const args: Prisma.UserUpdateArgs = {
  //     where: { id },
  //     data: {
  //       ...dto,
  //       updatedBy: authUser.user.userId,
  //     },
  //   };
  //   return this.update(args);
  // }

  // async archiveUser(id: string) {
  //   const sample = await this.findFirst({
  //     where: { id },
  //   });
  //   if (!sample) {
  //     throw new NotFoundException('Container Type not found!');
  //   }

  //   return this.update({
  //     where: { id },
  //     data: {
  //       status: false,
  //     },
  //   });
  // }
}

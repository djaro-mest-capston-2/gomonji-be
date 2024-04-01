import { CrudMapType } from '../common/interfaces/crud-map-type.interface';
import { Prisma } from '@prisma/client';

export class UserMapType implements CrudMapType {
  aggregate: Prisma.UserAggregateArgs;
  count: Prisma.UserCountArgs;
  create: Prisma.UserCreateArgs;
  createMany: Prisma.UserCreateManyArgs;
  delete: Prisma.UserDeleteArgs;
  deleteMany: Prisma.UserDeleteManyArgs;
  findFirst: Prisma.UserFindFirstArgs;
  findMany: Prisma.UserFindManyArgs;
  findUnique: Prisma.UserFindUniqueArgs;
  update: Prisma.UserUpdateArgs;
  updateMany: Prisma.UserUpdateManyArgs;
  upsert: Prisma.UserUpsertArgs;
}

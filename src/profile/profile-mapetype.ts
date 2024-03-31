import { CrudMapType } from '../common/interfaces/crud-map-type.interface';
import { Prisma } from '@prisma/client';

export class ProfileMapType implements CrudMapType {
  aggregate: Prisma.ProfileAggregateArgs;
  count: Prisma.ProfileCountArgs;
  create: Prisma.ProfileCreateArgs;
  createMany: Prisma.ProfileCreateManyArgs;
  delete: Prisma.ProfileDeleteArgs;
  deleteMany: Prisma.ProfileDeleteManyArgs;
  findFirst: Prisma.ProfileFindFirstArgs;
  findMany: Prisma.ProfileFindManyArgs;
  findUnique: Prisma.ProfileFindUniqueArgs;
  update: Prisma.ProfileUpdateArgs;
  updateMany: Prisma.ProfileUpdateManyArgs;
  upsert: Prisma.ProfileUpsertArgs;
}

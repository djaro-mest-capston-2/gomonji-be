import { CrudMapType } from '../common/interfaces/crud-map-type.interface';
import { Prisma } from '@prisma/client';

export class TripMapType implements CrudMapType {
  aggregate: Prisma.TripAggregateArgs;
  count: Prisma.TripCountArgs;
  create: Prisma.TripCreateArgs;
  createMany: Prisma.TripCreateManyArgs;
  delete: Prisma.TripDeleteArgs;
  deleteMany: Prisma.TripDeleteManyArgs;
  findFirst: Prisma.TripFindFirstArgs;
  findMany: Prisma.TripFindManyArgs;
  findUnique: Prisma.TripFindUniqueArgs;
  update: Prisma.TripUpdateArgs;
  updateMany: Prisma.TripUpdateManyArgs;
  upsert: Prisma.TripUpsertArgs;
}

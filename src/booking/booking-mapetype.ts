import { CrudMapType } from '../common/interfaces/crud-map-type.interface';
import { Prisma } from '@prisma/client';

export class BookingMapType implements CrudMapType {
  aggregate: Prisma.BookingAggregateArgs;
  count: Prisma.BookingCountArgs;
  create: Prisma.BookingCreateArgs;
  createMany: Prisma.BookingCreateManyArgs;
  delete: Prisma.BookingDeleteArgs;
  deleteMany: Prisma.BookingDeleteManyArgs;
  findFirst: Prisma.BookingFindFirstArgs;
  findMany: Prisma.BookingFindManyArgs;
  findUnique: Prisma.BookingFindUniqueArgs;
  update: Prisma.BookingUpdateArgs;
  updateMany: Prisma.BookingUpdateManyArgs;
  upsert: Prisma.BookingUpsertArgs;
}

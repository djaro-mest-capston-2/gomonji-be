import { CrudMapType } from '../../common/interfaces/crud-map-type.interface';
import { Prisma } from '@prisma/client';

export class TripImagesMapType implements CrudMapType {
  aggregate: Prisma.TripImagesAggregateArgs;
  count: Prisma.TripImagesCountArgs;
  create: Prisma.TripImagesCreateArgs;
  createMany: Prisma.TripImagesCreateManyArgs;
  delete: Prisma.TripImagesDeleteArgs;
  deleteMany: Prisma.TripImagesDeleteManyArgs;
  findFirst: Prisma.TripImagesFindFirstArgs;
  findMany: Prisma.TripImagesFindManyArgs;
  findUnique: Prisma.TripImagesFindUniqueArgs;
  update: Prisma.TripImagesUpdateArgs;
  updateMany: Prisma.TripImagesUpdateManyArgs;
  upsert: Prisma.TripImagesUpsertArgs;
}

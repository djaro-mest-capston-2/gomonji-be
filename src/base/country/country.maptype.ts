import { CrudMapType } from '../../common/interfaces/crud-map-type.interface';
import { Prisma } from '@prisma/client';

export class CountryMapType implements CrudMapType {
  aggregate: Prisma.CountryAggregateArgs;
  count: Prisma.CountryCountArgs;
  create: Prisma.CountryCreateArgs;
  delete: Prisma.CountryDeleteArgs;
  deleteMany: Prisma.CountryDeleteManyArgs;
  findFirst: Prisma.CountryFindFirstArgs;
  findMany: Prisma.CountryFindManyArgs;
  findUnique: Prisma.CountryFindUniqueArgs;
  update: Prisma.CountryUpdateArgs;
  updateMany: Prisma.CountryUpdateManyArgs;
  upsert: Prisma.CountryUpsertArgs;
}

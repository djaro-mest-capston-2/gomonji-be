import { CrudMapType } from '../../common/interfaces/crud-map-type.interface';
import { Prisma } from '@prisma/client';

export class StateMapType implements CrudMapType {
  aggregate: Prisma.StateAggregateArgs;
  count: Prisma.StateCountArgs;
  create: Prisma.StateCreateArgs;
  delete: Prisma.StateDeleteArgs;
  deleteMany: Prisma.StateDeleteManyArgs;
  findFirst: Prisma.StateFindFirstArgs;
  findMany: Prisma.StateFindManyArgs;
  findUnique: Prisma.StateFindUniqueArgs;
  update: Prisma.StateUpdateArgs;
  updateMany: Prisma.StateUpdateManyArgs;
  upsert: Prisma.StateUpsertArgs;
}

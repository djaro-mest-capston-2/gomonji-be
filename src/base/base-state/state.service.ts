import { Prisma as Prisma, PrismaClient as PrismaClient } from '@prisma/client';
import { CrudService } from '../../common/database/crud.service';
import { Injectable } from '@nestjs/common';
import { StateMapType } from './state.maptype';

@Injectable()
export class StateService extends CrudService<
  Prisma.StateDelegate,
  StateMapType
> {
  constructor(private prismaClient: PrismaClient) {
    super(prismaClient.state);
  }
}

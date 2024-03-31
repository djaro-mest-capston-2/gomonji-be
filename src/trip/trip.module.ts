import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { PrismaClient } from '@prisma/client'; 
import { AppUtilities } from '../app.utilities';

@Module({
  providers: [TripService, PrismaClient, AppUtilities], 
  exports: [TripService],
})
export class TripModule {}

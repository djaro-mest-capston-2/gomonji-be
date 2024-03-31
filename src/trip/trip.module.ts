import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { PrismaClient } from '@prisma/client'; // Import PrismaClient
import { AppUtilities } from '../app.utilities';

@Module({
  providers: [TripService, PrismaClient, AppUtilities], // Include PrismaClient in the providers array
  exports: [TripService],
})
export class TripModule {}

import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { PrismaClient } from '@prisma/client';
import { AppUtilities } from '../app.utilities';
import { TripImagesService } from './trip-images/trip-images.service';

@Module({
  providers: [TripService, TripImagesService, PrismaClient, AppUtilities],
  exports: [TripService, TripImagesService],
})
export class TripModule {}

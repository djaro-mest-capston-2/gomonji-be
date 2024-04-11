import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AppUtilities } from '../app.utilities';
import { BookingService } from './booking.service';

@Module({
  providers: [BookingService, PrismaClient, AppUtilities],
  exports: [BookingService],
})
export class BookingModule {}

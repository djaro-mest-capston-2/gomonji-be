import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { PrismaClient } from '@prisma/client'; // Import PrismaClient
import { AppUtilities } from '../app.utilities';

@Module({
  providers: [ProfileService, PrismaClient, AppUtilities], // Include PrismaClient in the providers array
  exports: [ProfileService],
})
export class ProfileModule {}

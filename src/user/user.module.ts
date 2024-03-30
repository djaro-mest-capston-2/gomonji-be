import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaClient } from '@prisma/client';  // Import PrismaClient
import { AppUtilities } from '../app.utilities';

@Module({
  providers: [UserService, PrismaClient, AppUtilities],  // Include PrismaClient in the providers array
  exports: [UserService],
})
export class UserModule {}

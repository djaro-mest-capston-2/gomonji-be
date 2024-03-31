import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { PrismaClient } from '@prisma/client'; 
import { AppUtilities } from '../app.utilities';

@Module({
  providers: [ProfileService, PrismaClient, AppUtilities], 
  exports: [ProfileService],
})
export class ProfileModule {}

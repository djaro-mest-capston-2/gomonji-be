import { Injectable } from '@nestjs/common';
import { Prisma as Prisma, PrismaClient as PrismaClient, User } from '@prisma/client';
import { CrudService } from '../common/database/crud.service';
import { ProfileMapType } from './profile-mapetype';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class ProfileService extends CrudService<Prisma.ProfileDelegate, ProfileMapType> {
  constructor(private prisma: PrismaClient) {
    super(prisma.profile);
  }

  async createProfile({
    userId,
    countryId,
    stateId,
    firstName,
    lastName,
    ...items
  }: CreateProfileDto, Req: User) {
    return this.prisma.profile.create({
      data: {
        ...items,
        firstName,
        lastName,
        user: {
          connect: {
            id: userId,
          },
        },
        country: countryId
          ? {
              connect: {
                id: countryId,
              },
            }
          : undefined,
        state: stateId
          ? {
              connect: {
                id: stateId,
              },
            }
          : undefined,
      
        createdAt: new Date(),
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import {
  Prisma as Prisma,
  PrismaClient as PrismaClient,
  User,
} from '@prisma/client';
import { CrudService } from '../../common/database/crud.service';
import { ProfileMapType } from './profile-mapetype';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService extends CrudService<
  Prisma.ProfileDelegate,
  ProfileMapType
> {
  constructor(private prisma: PrismaClient) {
    super(prisma.profile);
  }

  async createProfile(
    {
      countryId,
      stateId,
      firstName,
      lastName,
      phoneNo,
      companyName,
      website,
      brandName,
      description,
      background,
    }: CreateProfileDto,
    id: string,
    authUser: User,
  ) {
    return this.prisma.profile.create({
      data: {
        firstName,
        lastName,
        user: {
          connect: {
            id,
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
        ...(phoneNo && { phoneNo }),
        ...(companyName && { companyName }),
        ...(website && { website }),
        ...(brandName && { brandName }),
        ...(description && { description }),
        ...(background && { background }),

        createdAt: new Date(),
      },
    });
  }

  async updateProfile(
    authUser: User,
    id: string,
    dto: UpdateProfileDto,
  ) {
    const args: Prisma.ProfileUpdateArgs = {
      where: { userId: id},
      data: {
        ...dto,
        updatedBy: authUser.id,
      },
    };
    return this.update(args);
  }
}

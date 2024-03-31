import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  Req,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { GetProfilesFilterDto } from './dto/get-profile-filter-dto';
import { CreateProfileDto } from './dto/create-profile-dto';
import { User } from '@prisma/client';
@ApiBearerAuth()
@ApiTags('Profiles')
@Controller('Profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getAll(
    @Query() filtersDto: GetProfilesFilterDto,
    @Req() req: User,
  ) {
    return this.profileService.getAll(filtersDto, req);
  }

  @Get('/:id/info')
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.profileService.findFirstOrThrow({ where: { id } });
  }

  @Post()
  
  async createProfile(
    @Req() req: User,
    @Body() dto: CreateProfileDto,
  ) {
    return this.profileService.createProfile(dto, req);
  }
}

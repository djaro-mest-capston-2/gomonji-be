import {
  Controller,
  Get,
  Query,
  Req,
  Param,
  ParseUUIDPipe,
  Post,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { GetUsersFilterDto } from './dto/get-user-filter.dto';
import { User } from '@prisma/client';
import { CreateProfileDto } from 'src/user/profile/dto/create-profile.dto';
import { ProfileService } from 'src/user/profile/profile.service';
@ApiBearerAuth()
@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService
    ) {}

  @Get()
  async getAll(
    @Query() filtersDto: GetUsersFilterDto,
    @Req() req: User,
  ) {
    return this.userService.getUsers(filtersDto, req);
  }

  @Get('/:id/info')
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findFirstOrThrow({ where: { id } });
  }

  @Post('/:id/profile')
  async createProfile(
    @Body() dto: CreateProfileDto,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() authUser: User,
  ) {
    return this.profileService.createProfile(dto, id, authUser);
  }

}

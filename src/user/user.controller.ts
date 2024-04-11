import {
  Controller,
  Get,
  Query,
  Req,
  Param,
  ParseUUIDPipe,
  Post,
  Body,
  Delete,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { GetUsersFilterDto } from './dto/get-user-filter.dto';
import { User } from '@prisma/client';
import { CreateProfileDto } from 'src/user/profile/dto/create-profile.dto';
import { ProfileService } from 'src/user/profile/profile.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { UpdateProfileDto } from './profile/dto/update-profile.dto';
import { ApiResponseMeta } from 'src/common/decorators/response.decorator';
@ApiBearerAuth()
@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
  ) {}

  @Get()
  async getAll(@Query() filtersDto: GetUsersFilterDto, @Req() req: User) {
    return this.userService.getAll(filtersDto, req);
  }

  @Get('/:id/info')
  async getOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: User) {
    return this.userService.getOne(id, req);
  }

  @Public()
  @Post('/:id/profile')
  async createProfile(
    @Body() dto: CreateProfileDto,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() authUser: User,
  ) {
    return this.profileService.createProfile(dto, id, authUser);
  }

  @Public()
  @Patch('/:id/profile')
  async updateProfile(
    @Req() authUser: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(authUser, id, dto);
  }

  @Public()
  @ApiResponseMeta({ message: 'User archived successfully!' })
  @Delete('/:id/archive')
  async deleteSample(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.archiveUser(id);
  }
}

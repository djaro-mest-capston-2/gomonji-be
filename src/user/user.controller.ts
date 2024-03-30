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
import { RequestWithUser } from '../auth/interfaces';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { GetUsersFilterDto } from './dto/get-user-filter-dto';
import { CreateUserDto } from './dto/create-user-dto';
@ApiBearerAuth()
@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getAll(
    @Query() filtersDto: GetUsersFilterDto,
    @Req() req: RequestWithUser,
  ) {
    return this.userService.getUsers(filtersDto, req);
  }

  @Get('/:id/info')
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findFirstOrThrow({ where: { id } });
  }

  @Post()
  async postContainer(
    // @Req() req: RequestWithUser,
    @Body() dto: CreateUserDto,
  ) {
    return this.userService.createUser(dto);
  }

  // @Patch('/tests/container-types/:id/update')
  // async updateContainerType(
  //   @Req() req: RequestWithUser,
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() dto: UpdateContainerTypeDto,
  // ) {
  //   return this.userService.updateContainerType(req, id, dto);
  // }

  // @ApiResponseMeta({ message: 'Container Types archived successfully!' })
  // @Delete('/tests/container-types/:id/archive')
  // async deleteSample(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.userService.archiveContainerType(id);
  // }
}

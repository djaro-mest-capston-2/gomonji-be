import {
  Controller,
  Get,
  Query,
  Req,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { GetUsersFilterDto } from './dto/get-user-filter.dto';
import { User } from '@prisma/client';
@ApiBearerAuth()
@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
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

}

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
import { TripService } from './trip.service';
import { GetTripsFilterDto } from './dto/get-trip-filter-dto';
import { CreateTripDto } from './dto/create-trip-dto';
@ApiBearerAuth()
@ApiTags('Trips')
@Controller('trip')
export class TripController {
  constructor(private readonly TripService: TripService) {}

  @Get()
  async getAll(
    @Query() filtersDto: GetTripsFilterDto,
    @Req() req: RequestWithUser,
  ) {
    return this.TripService.getTrips(filtersDto, req);
  }

  @Get('/:id/info')
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.TripService.findFirstOrThrow({ where: { id } });
  }

  @Post()
  
  async createTrip(
    @Req() req: RequestWithUser,
    @Body() dto: CreateTripDto,
  ) {
    return this.TripService.createTrip(dto, req);
  }

  // @Patch('/tests/container-types/:id/update')
  // async updateContainerType(
  //   @Req() req: RequestWithUser,
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() dto: UpdateContainerTypeDto,
  // ) {
  //   return this.TripService.updateContainerType(req, id, dto);
  // }

  // @ApiResponseMeta({ message: 'Container Types archived successfully!' })
  // @Delete('/tests/container-types/:id/archive')
  // async deleteSample(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.TripService.archiveContainerType(id);
  // }
}

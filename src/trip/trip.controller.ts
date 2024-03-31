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
import { TripService } from './trip.service';
import { GetTripsFilterDto } from './dto/get-trip-filter-dto';
import { CreateTripDto } from './dto/create-trip-dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { User } from '@prisma/client';
@ApiBearerAuth()
@ApiTags('Trips')
@Controller('trip')
export class TripController {
  constructor(private readonly TripService: TripService) {}

  @Public()
  @Get()
  async getAll(
    @Query() filtersDto: GetTripsFilterDto,
    @Req() req: User,
  ) {
    return this.TripService.getTrips(filtersDto, req);
  }

  @Public()
  @Get('/:id/info')
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.TripService.findFirstOrThrow({ where: { id } });
  }

  @Post()
  async createTrip(
    @Req() req: User,
    @Body() dto: CreateTripDto,
  ) {
    return this.TripService.createTrip(dto, req);
  }
}

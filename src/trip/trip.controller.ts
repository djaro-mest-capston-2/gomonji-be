import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  Req,
  Param,
  ParseUUIDPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TripService } from './trip.service';
import { GetTripsFilterDto } from './dto/get-trip-filter.dto';
import { CreateTripDto } from './dto/create-trip.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { User } from '@prisma/client';
import { ApiResponseMeta } from 'src/common/decorators/response.decorator';
import { UpdateTripDto } from './dto/update-trip.dto';

@ApiBearerAuth()
@ApiTags('Trips')
@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Public()
  @Get()
  async getAll(@Query() filtersDto: GetTripsFilterDto, @Req() req: User) {
    return this.tripService.getAll(filtersDto, req);
  }

  @Public()
  @Get('/:id/info')
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tripService.findFirstOrThrow({ where: { id } });
  }

  @Post()
  async createTrip(@Req() req: User, @Body() dto: CreateTripDto) {
    return this.tripService.createTrip(dto, req);
  }

  @Patch('/:id/update')
  async updateTrip(
    @Req() req: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTripDto,
  ) {
    return this.tripService.updateTrip(req, id, dto);
  }

  @ApiResponseMeta({ message: 'Trip successfully cancelled!' })
  @Delete('/:id/cancel')
  async cancelTrip(@Param('id', ParseUUIDPipe) id: string) {
    return this.tripService.cancelTrip(id);
  }
}

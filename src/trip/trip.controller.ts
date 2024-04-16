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
import { TripImagesService } from './trip-images/trip-images.service';
import { GetTripImagesFilterDto } from './trip-images/dto/get-trip-images-filter.dto';
import { CreateTripImagesDto } from './trip-images/dto/create-trip-images.dto';
import { UpdateTripImagesDto } from './trip-images/dto/update-trip-images.dto';

@ApiBearerAuth()
@ApiTags('Trips')
@Controller('trip')
export class TripController {
  constructor(
    private readonly tripService: TripService,
    private readonly tripPhotosService: TripImagesService
    ) {}

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

  @Public()
  @Patch('/:id/update')
  async updateTrip(
    @Req() req: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTripDto,
  ) {
    return this.tripService.updateTrip(req, id, dto);
  }

  @Public()
  @ApiResponseMeta({ message: 'Trip successfully cancelled!' })
  @Delete('/:id/cancel')
  async cancelTrip(@Param('id', ParseUUIDPipe) id: string) {
    return this.tripService.cancelTrip(id);
  }

  @Public()
  @Get('/image')
  async getTripImages(@Query() filtersDto: GetTripImagesFilterDto, @Req() req: User) {
    return this.tripPhotosService.getAll(filtersDto, req);
  }

  @Public()
  @Get('/image/:id/info')
  async getTripImage(@Param('id', ParseUUIDPipe) id: string) {
    return this.tripPhotosService.findFirstOrThrow({ where: { id } });
  }

  @Post('/image')
  async createTripImages(@Req() req: User, @Body() dto: CreateTripImagesDto) {
    return this.tripPhotosService.createTripImages(dto, req);
  }

  @Public()
  @Patch('/image/:id/update')
  async updateTripImage(
    @Req() req: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTripImagesDto,
  ) {
    return this.tripPhotosService.updateTripImages(req, id, dto);
  }

  @Public()
  @ApiResponseMeta({ message: 'Trip successfully cancelled!' })
  @Delete('/image/:id/cancel')
  async cancelTripImage(@Param('id', ParseUUIDPipe) id: string) {
    return this.tripPhotosService.cancelTripImage(id);
  }
}

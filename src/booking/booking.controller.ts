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
import { Public } from 'src/auth/decorators/public.decorator';
import { User } from '@prisma/client';
import { ApiResponseMeta } from 'src/common/decorators/response.decorator';
import { BookingService } from './booking.service';
import { GetBookingsFilterDto } from './dto/get-bookings-filter.dto';
import { BookTripDto } from './dto/book-trip.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@ApiBearerAuth()
@ApiTags('Trip Booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Public()
  @Get()
  async getAll(@Query() filtersDto: GetBookingsFilterDto, @Req() req: User) {
    return this.bookingService.getAll(filtersDto, req);
  }

  @Public()
  @Get('/:id/info')
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingService.findFirstOrThrow({ where: { id } });
  }

  @Post()
  async bookTrip(@Req() req: User, @Body() dto: BookTripDto) {
    return this.bookingService.bookTrip(dto, req);
  }

  @Patch('/:id/update')
  async updateTrip(
    @Req() req: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBookingDto,
  ) {
    return this.bookingService.updateBooking(req, id, dto);
  }

  @ApiResponseMeta({ message: 'Booking successfully cancelled!' })
  @Delete('/:id/cancel')
  async cancelTrip(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingService.cancelBooking(id);
  }
}

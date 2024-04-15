import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Prisma as Prisma,
  PrismaClient as PrismaClient,
  User,
} from '@prisma/client';
import { CrudService } from '../common/database/crud.service';
import moment from 'moment';
import { AppUtilities } from '../app.utilities';
import { BookingMapType } from './booking-mapetype';
import {
  GetBookingsFilterDto,
  MapBookingOrderByToValue,
} from './dto/get-bookings-filter.dto';
import { BookTripDto } from './dto/book-trip.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingService extends CrudService<
  Prisma.BookingDelegate,
  BookingMapType
> {
  constructor(private prisma: PrismaClient) {
    super(prisma.booking);
  }

  async getAll(
    {
      page,
      size,
      orderBy,
      cursor,
      direction,
      ...filters
    }: GetBookingsFilterDto,
    req: User,
  ) {
    const parseSplittedTermsQuery = (term: string) => {
      const parts = term.trim().split(/\s+/);
      if (parts.length > 0) {
        return {
          name: { in: parts, mode: 'insensitive' },
        };
      }
      return undefined;
    };

    const parsedQueryFilters = this.parseQueryFilter(filters, [
      {
        key: 'term',
        where: parseSplittedTermsQuery,
      },
      {
        key: 'startDate',
        where: (startDate, filterDto) => {
          const mStartDate = moment
            .parseZone(filterDto.startDate)
            .startOf('day')
            .toDate();
          return {
            createdAt: {
              gte: mStartDate,
              ...(!filterDto.endDate && {
                lte: moment
                  .parseZone(filterDto.startDate)
                  .endOf('day')
                  .toDate(),
              }),
            },
          };
        },
      },
      {
        key: 'endDate',
        where: (endDate, filterDto) => {
          const mEndDate = moment
            .parseZone(filterDto.endDate)
            .endOf('day')
            .toDate();
          return {
            createdAt: {
              lte: mEndDate,
              ...(!filterDto.startDate && {
                gte: moment
                  .parseZone(filterDto.endDate)
                  .startOf('day')
                  .toDate(),
              }),
            },
          };
        },
      },
      {
        key: 'status',
        where: (value: string) => {
          return { status: value === 'true' };
        },
      },
    ]);

    const args: Prisma.BookingFindManyArgs = {
      where: {
        ...parsedQueryFilters,
      },
      include: {
        trip: true,
        bill: true,
        invoice: true,
        transaction: true,
      },
    };

    return this.findManyPaginate(args, {
      page,
      size,
      cursor,
      direction,
      orderBy:
        orderBy &&
        AppUtilities.unflatten({
          [MapBookingOrderByToValue[orderBy]]: direction,
        }),
    });
  }

  async bookTrip(
    {
      tripId,
      billId,
      invoiceId,
      transactionId,
      firstName,
      lastName,
      email,
      phoneNo,
    }: BookTripDto,
    Req: User,
  ) {
    return this.prisma.booking.create({
      data: {
        trip: {
          connect: {
            id: tripId,
          },
        },
        ...(billId && {
          bill: {
            connect: {
              id: billId,
            },
          },
        }),
        ...(invoiceId && {
          invoice: {
            connect: {
              id: invoiceId,
            },
          },
        }),
        ...(transactionId && {
          transaction: {
            connect: {
              id: transactionId,
            },
          },
        }),
        firstName,
        ...(lastName && { lastName }),
        email,
        ...(phoneNo && { phoneNo }),

        createdAt: new Date(),
      },
    });
  }

  async updateBooking(authUser: User, id: string, dto: UpdateBookingDto) {
    const args: Prisma.BookingUpdateArgs = {
      where: { id },
      data: {
        ...dto,
        updatedBy: authUser.id,
      },
    };
    return this.update(args);
  }

  async cancelBooking(id: string) {
    const sample = await this.findFirstOrThrow({
      where: { id },
    });
    if (!sample) {
      throw new NotFoundException('Booking not found!');
    }
    return this.update({
      where: { id },
      data: {
        status: false,
      },
    });
  }
}

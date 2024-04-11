import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppUtilities } from './app.utilities';
import { TripModule } from './trip/trip.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import { UserController } from './user/user.controller';
import { TripController } from './trip/trip.controller';
import { ProfileModule } from './user/profile/profile.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guards/jwt.guard';
import { BookingModule } from './booking/booking.module';
import { BookingController } from './booking/booking.controller';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    AuthModule,
    UserModule,
    TripModule,
    ProfileModule,
    BookingModule,
  ],
  controllers: [AppController, UserController, TripController, BookingController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    AppUtilities,
  ],
  exports: [AppUtilities, AuthModule, UserModule, ProfileModule, BookingModule, TripModule],
})
export class AppModule {}

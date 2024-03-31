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
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';
import { ProfileModule } from './profile/profile.module';

@Global()
@Module({
  controllers: [AppController, UserController, TripController, ProfileController],
  providers: [AppService, AppUtilities],
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    TripModule,
    ProfileModule,
  ],
  exports: [AppUtilities, AuthModule, UserModule, ProfileModule],
})
export class AppModule {}

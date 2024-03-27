import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppUtilities } from './app.utilities';
import { TripModule } from './trip/trip.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';
@Global()
@Module({
  controllers: [AppController],
  providers: [
    AppService,
    AppUtilities,
  ],
  exports: [
    AppUtilities,
  ],
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }), TripModule, AuthModule, UsersModule],
})
export class AppModule {}

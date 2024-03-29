import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppUtilities } from './app.utilities';
import { TripModule } from './trip/trip.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';

@Global()
@Module({
  controllers: [AppController],
  providers: [AppService, AppUtilities],
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    TripModule,
    AuthModule,
    UserModule,
  ],
  exports: [AppUtilities],
})
export class AppModule {}

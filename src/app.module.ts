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

@Global()
@Module({
  controllers: [AppController, UserController],
  providers: [AppService, AppUtilities],
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    TripModule,
  ],
  exports: [
    AppUtilities,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}

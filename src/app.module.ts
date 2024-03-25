import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppUtilities } from './app.utilities';

@Global()
@Module({
  // imports: [
  //   ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
  // ],
  controllers: [AppController],
  providers: [
    AppService,
    AppUtilities,
  ],
  exports: [
    AppUtilities,
  ],
})
export class AppModule {}

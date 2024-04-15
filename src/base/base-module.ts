import { CountryModule } from './country/country.module';
import { Module } from '@nestjs/common';
// import { CountryService } from './country/country.service';
// import { PrismaClient } from '@prisma/client';
// import { AppUtilities } from 'src/app.utilities';
// import { StateService } from './base-state/state.service';

@Module({
  providers: [],
  exports: [CountryModule],
  imports: [CountryModule],
})
export class BaseModule {}

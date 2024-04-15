import { StateService } from '../base-state/state.service';
import { Module } from '@nestjs/common';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';
import { PrismaClient } from '@prisma/client';
// import { AppUtilities } from 'src/app.utilities';

@Module({
  providers: [CountryService, StateService, PrismaClient],
  controllers: [CountryController, ],
})
export class CountryModule {}

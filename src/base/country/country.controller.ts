import { StateService } from '../base-state/state.service';
import { PaginationSearchOptionsDto } from '../../common/interfaces/pagination-search-options.dto';
import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Country, Prisma, User } from '@prisma/client';
import lodash from 'lodash';
import { CountryService } from './country.service';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Countries & Currencies')
@Controller('countries')
export class CountryController {
  constructor(
    private readonly countryService: CountryService,
    private readonly stateService: StateService,
  ) {}

  @Public()
  @Get()
  async findAll(@Query() dto: PaginationSearchOptionsDto) {
    return this.countryService.getCountries(dto);
  }

  @Public()
  @Get('/:id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: User,
    useSelect = true,
  ) {
    const dto: Prisma.CountryFindFirstArgs = {
      where: { id: id },
      include: { states: true },
    };

    const result = await this.countryService.findFirstOrThrow(dto);

    const retComp: Country = <Country>result;
    return result;
  }

  @Public()
  @Get(':id/states')
  async getStates(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() { term, ...pagination }: PaginationSearchOptionsDto,
  ) {
    const dto: Prisma.StateFindManyArgs = {
      where: { countryId: id },
    };

    dto.where = term
      ? {
          AND: [{ ...dto.where }],
          OR: [
            {
              name: {
                contains: term,
                mode: 'insensitive',
              },
            },
            {
              iso2: {
                contains: term,
                mode: 'insensitive',
              },
            },
          ],
        }
      : dto.where;

    // if (req.selectFields) {
    //   dto.select = req.selectFields;
    // }
    return this.stateService.findManyPaginate(dto, pagination);
  }

  @Public()
  @Get('/:countryId/states/:id')
  async findOneState(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('countryId', ParseUUIDPipe) countryId: string,
  ) {
    const dto: Prisma.StateFindFirstArgs = {
      where: { countryId: countryId, id: id },
    };

    // if (req.selectFields) {
    //   dto.select = req.selectFields;
    // }
    return this.stateService.findFirstOrThrow(dto);
  }
}

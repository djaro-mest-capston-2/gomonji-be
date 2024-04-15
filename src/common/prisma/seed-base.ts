import { PrismaClient } from '@prisma/client';
import { countrySeed } from '../database/seed-data/country.seed';
import { stateSeed } from '../database/seed-data/state.seed';

const prisma = new PrismaClient();

const promises = [];

//==============================================================//
//********************** SEEDING BASE TABLES *******************//
//==============================================================//
// 1. Seed base_country and base_state tables
promises.push(
  new Promise(async (res, rej) => {
    try {
      await prisma.country.createMany({
        data: countrySeed,
        skipDuplicates: true,
      });
      const nga = countrySeed.find((country) => country.iso2 === 'NG');

      // 2. Seed State Template
      await prisma.state.createMany({
        data: stateSeed.map((state) => ({
          ...state,
          countryId: nga.id,
        })),
        skipDuplicates: true,
      });
      res(true);
    } catch (e) {
      rej(e);
    }
  }),
);

Promise.all(promises)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Gomonji DB Seeded successfully.');
    await prisma.$disconnect();
  });

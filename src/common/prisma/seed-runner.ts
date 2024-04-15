// import { PrismaClient as TenantPrismaClient } from '.prisma/tenant';
import { PrismaClient } from '@prisma/client';
import argsParser from 'args-parser';
import { existsSync } from 'fs';
import path from 'path';
import { argv } from 'process';
import { SeedRunner } from '../database/seed-data/runners/interface';

const baseDir = path.join(__dirname, '../database/seed-data/runners');

const args = argsParser(argv);

if (!Object.entries(args).length) {
  console.error('No args passed!');
  process.exit();
}
if (!args['seed-file']) {
  //console.log(args['seed-file']);
  console.error('--seed-file= argument not provided!');
  process.exit();
}

const promises = [];
const prisma = args.tenant
  ? new PrismaClient({
      // log: ['query', 'info', 'warn', 'error'],
      datasources: {
        db: {
          url: String(process.env.DATABASE_URL).replace(
            'schema=public',
            `schema=${args.tenant}&connection_limit=1`,
          ),
        },
      },
    })
  : new PrismaClient();

promises.push(
  new Promise(async (res, rej) => {
    try {
      // load seed file
      const seedFilePath = path.join(baseDir, `${args['seed-file']}.runner.ts`);
      if (!existsSync(seedFilePath)) {
        throw new Error(`-> seed file '${seedFilePath}' does not exists!`);
      }

      const runner = new (await import(seedFilePath)).default(prisma);
      if (!(runner instanceof SeedRunner)) {
        throw new Error('-> seed file does not contain any runner.');
      }

      await runner.run();

      res(true);
    } catch (e) {
      console.log('caught erooo......');
      rej(e);
    }
  }),
);

Promise.all(promises)
  .catch((e) => {
    console.log('exiting...');
    console.error(e);
    process.exit(1);
  })
  .then(() => {
    console.log('-> custom DB Seeding ran successfully!');
    process.exit(0);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

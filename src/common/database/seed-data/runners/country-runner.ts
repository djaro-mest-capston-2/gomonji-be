// import { PrismaClient } from '@prisma/client';
// import { SeedRunner } from './interface';
// import { countrySeed } from '../country.seed';

// export default class CountryRunner extends SeedRunner {
//   constructor(private prisma: PrismaClient) {
//     super();
//   }

//   async run() {
//     return Promise.all([
//       this.prisma.country.upsert({
//         where: { id: countrySeed.id },
//         create: countrySeed,
//         update: {},
//       }),
//     ]);
//   }
// }

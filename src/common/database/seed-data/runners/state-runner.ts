// import { PrismaClient } from '@prisma/client';
// import { SeedRunner } from './interface';
// import { stateSeed } from '../state.seed';

// export default class AppCalendarSettingsRunner extends SeedRunner {
//   constructor(private prisma: PrismaClient) {
//     super();
//   }

//   async run() {
//     return Promise.all([
//       this.prisma.state.upsert({
//         where: { id: stateSeed.id },
//         create: stateSeed,
//         update: {},
//       }),
//     ]);
//   }
// }

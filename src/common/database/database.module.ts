// import { RequestWithUser } from '@@auth/interfaces';
// import { PrismaClient as TenantPrismaClient } from '@@prisma/tenant';
// import { FactoryProvider, Module, Scope } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { REQUEST } from '@nestjs/core';
// import { PrismaClient } from '@prisma/client';
// import { PrismaClientManager } from './prisma-client-manager';
// import { PrismaService } from './prisma.service';

// const tenantPrismaClientProvider: FactoryProvider<Promise<TenantPrismaClient>> =
//   {
//     provide: TenantPrismaClient,
//     scope: Scope.REQUEST,
//     inject: [REQUEST, PrismaClientManager],
//     useFactory: async (
//       request: RequestWithUser,
//       manager: PrismaClientManager,
//     ) => manager.getTenantPrismaClientFromRequest(request),
//   };

// @Module({
//   imports: [ConfigModule],
//   providers: [
//     PrismaClient,
//     PrismaClientManager,
//     PrismaService,
//     tenantPrismaClientProvider,
//   ],
//   exports: [
//     PrismaClient,
//     PrismaClientManager,
//     PrismaService,
//     TenantPrismaClient,
//     tenantPrismaClientProvider,
//   ],
// })
// export class DatabaseModule {}

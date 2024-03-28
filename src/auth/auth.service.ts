// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { UsersService } from '../users/users.service';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class AuthService {
//   constructor(
//     private usersService: UsersService,
//     private jwtService: JwtService
//   ) {}

//   async signIn(
//     username: string,
//     pass: string,
//   ): Promise<{ access_token: string }> {
//     const user = await this.usersService.findOne(username);
//     if (user?.password !== pass) {
//       throw new UnauthorizedException();
//     }
//     const payload = { sub: user.userId, username: user.username };
//     console.log('payload', payload);
//     return {
//       access_token: await this.jwtService.signAsync(payload),
//     };
//   }
// }

// import { AppUtilities } from '@@/app.utilities';
// import { BaseTenantService } from '@@base/base-tenant/base-tenant.service';
// import { CacheKeysEnums } from '@@common/cache/cache.enum';
// import { CacheService } from '@@common/cache/cache.service';
// import { PrismaClientManager } from '@@common/database/prisma-client-manager';
// import { MessagingService } from '@@common/messaging/messaging.service';
// import { Prisma } from '@@prisma/tenant';
// import { CorePasswordPolicyService } from '@@tenant/core-password-policy/core-password-policy.service';
// import { CoreUserService } from '@@tenant/core-user/core-user.service';
// import {
//   Injectable,
//   UnauthorizedException,
//   Logger,
//   ServiceUnavailableException,
//   NotAcceptableException,
//   NotFoundException,
//   BadRequestException,
// } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
// import { CookieOptions, Response } from 'express';
// import { AuthCredentialsDto } from './dto/auth-credentials.dto';
// import { ResetPasswordDto } from './dto/reset-password.dto';
// import { SetupTenantDto } from './dto/sign-up.dto';
// import { APP_NAME, JwtPayload } from './interfaces';
// import { FileService } from '@@/common/private-file/file.service';
// import { TenantRequestUploadDto } from './dto/tenant-request-upload.dto';
// import { S3FilePrivacy } from '@@/common/private-file/file.enum';
// import { AuthPractitionerQueryDto } from './dto/auth-practitioner.dto';
// import moment from 'moment';

// @Injectable()
// export class AuthService {
//   private jwtExpires: number;
//   private inviteSecret: string;

//   constructor(
//     private configService: ConfigService,
//     private jwtService: JwtService,
//     private cacheService: CacheService,
//     private prismaClientManager: PrismaClientManager,
//     private baseTenantService: BaseTenantService,
//     private messagingService: MessagingService,
//     private coreUserService: CoreUserService,
//     private passwordPolicyService: CorePasswordPolicyService,
//     private readonly fileService: FileService,
//   ) {
//     this.jwtExpires = this.configService.get<number>(
//       'jwt.signOptions.expiresIn',
//     );
//     this.inviteSecret = this.configService.get<string>('jwt.inviteSecret');
//   }

//   private readonly logger = new Logger(AuthService.name);

//   async signIn(
//     { email, password }: AuthCredentialsDto,
//     lastLoginIp: string,
//     response: Response,
//     sessionAuthenticated = false,
//   ): Promise<any> {
//     const prismaClient = this.prismaClientManager.getPrismaClient();
//     const user = await prismaClient.user.findUnique({
//       where: { email: email.toLowerCase() },
//       include: { tenant: true },
//     });

//     if (!user) {
//       throw new UnauthorizedException('Invalid credentials!');
//     }

//     if (!user.tenant.status) {
//       throw new UnauthorizedException(
//         'Account is not active, Please contact support!',
//       );
//     }

//     const tenantClient = this.prismaClientManager.getTenantPrismaClient(
//       user.tenantId,
//     );

//     const user = await this.coreUserService.findUserByEmail(
//       email,
//       tenantClient,
//     );
//     if (
//       !user ||
//       (!sessionAuthenticated &&
//         !(await this.passwordPolicyService.validateLoginPassword(
//           password,
//           {
//             id: user.id,
//             password: user.password,
//             passwordHistory: user.passwordHistory as string[],
//             passwordLockedAt: user.passwordLockedAt,
//             passwordUpdatedAt: user.passwordUpdatedAt,
//             passwordAttempt: user.passwordAttempt,
//           },
//           user.tenantId,
//         )))
//     ) {
//       throw new UnauthorizedException('Invalid credentials or Inactive User!');
//     }

//     // Get default branch
//     const accessToken = this.jwtService.sign(
//       {
//         userId: user.id,
//         tenantId: user.tenantId,
//         contactId: user.contactId,
//       },
//       {
//         secret: this.configService.get('jwt.secret'),
//         expiresIn: this.configService.get('jwt.refreshTokenExpiresIn'),
//       },
//     );
//     const [, , sessionId] = accessToken.split('.');

//     const payload: JwtPayload = {
//       type: 'user',
//       userId: user.id.toString(),
//       employeeId: user.employeeId,
//       email: email.toLowerCase(),
//       name: user.contact.firstName + ' ' + user.contact.lastName,
//       appName: APP_NAME,
//       tenantName: user.tenant.name,
//       tenantId: user.tenantId,
//       role: {
//         code: user.role.code,
//         schemaPermissions: user.role?.schemaPermissions,
//       },
//     };
//     //save user jwt token in redis
//     await this.cacheService.set(
//       `${CacheKeysEnums.TOKENS}:${user.id}:${sessionId}`,
//       payload,
//       this.jwtExpires,
//     );

//     // Update password attempt to 0
//     await tenantClient.user.update({
//       where: { id: user.id },
//       data: {
//         updatedBy: user.id,
//         lastLogin: new Date().toISOString(),
//         lastLoginIp,
//         passwordAttempt: 0,
//       },
//     });

//     // set response cookie
//     this.setCookies(accessToken, response);

//     // strip out the password before returning the user
//     const pwd = 'password';
//     const { [pwd]: _, ...usr } = user;

//     return {
//       token: accessToken,
//       user: {
//         ...usr,
//         defaultPage: usr.defaultPage,
//         role: { ...usr.role, menus: userMenus },
//       },
//     };
//   }

//   async signOut(userId: string) {
//     await this.cacheService.remove(CacheKeysEnums.TOKENS + userId);
//   }

//   async changePassword(resetPasswordDto: ResetPasswordDto) {
//     const { password, requestId, tenantId } = resetPasswordDto;

//     //Step 1: Switch Tenant
//     const tenantClient =
//       this.prismaClientManager.getTenantPrismaClient(tenantId);

//     //Step 2: Retrieve Requesting User Email from Redis
//     const storedEmail = await this.cacheService.get(
//       CacheKeysEnums.REQUESTS + requestId,
//     );
//     if (!storedEmail) {
//       throw new NotAcceptableException('Invalid Invite!');
//     }

//     // Get User
//     const modifyingUser = await tenantClient.coreUser.findFirst({
//       where: { email: storedEmail },
//     });
//     if (!modifyingUser) {
//       throw new NotAcceptableException('Invalid password reset request!');
//     }

//     const hashedPassword = await AppUtilities.hashAuthSecret(password);

//     // Validate proposed new password
//     await this.passwordPolicyService.validateChangePassword(
//       password,
//       hashedPassword,
//       {
//         id: modifyingUser.id,
//         passwordHistory: modifyingUser.passwordHistory as string[],
//         passwordUpdatedAt: modifyingUser.passwordUpdatedAt,
//       },
//       tenantId,
//     );
//     const dto: TenantPrisma.CoreUserUpdateArgs = {
//       where: { id: modifyingUser.id },
//       data: {
//         password: hashedPassword,
//         updatedBy: modifyingUser.id,
//         updatedAt: new Date().toISOString(),
//       },
//     };

//     await tenantClient.coreUser.update(dto);
//     // Clear Redis
//     await this.cacheService.remove(CacheKeysEnums.REQUESTS + requestId);
//   }

//   async uploadTenantRequestLogo(
//     dto: TenantRequestUploadDto,
//     logo?: Express.Multer.File,
//   ) {
//     if (!logo) {
//       throw new NotAcceptableException('File not uploaded ');
//     }
//     const uploadResult = await this.fileService.uploadFile({
//       imageBuffer: logo.buffer,
//       privacy: S3FilePrivacy.PUBLIC_READ,
//     });
//     return {
//       url: uploadResult.Location,
//       key: uploadResult.Key,
//       eTag: uploadResult.ETag,
//       bucket: uploadResult.Bucket,
//     };
//   }

//   // set cookie
//   private setCookies(token: string, response: Response) {
//     const maxAge = parseInt(process.env.JWT_EXPIRES);
//     const expires = new Date(new Date().getTime() + maxAge);
//     const cookieOptions: CookieOptions = { maxAge, expires, httpOnly: true };
//     if (['remote', 'prod'].includes(this.configService.get('app.stage'))) {
//       cookieOptions.sameSite = 'none';
//       cookieOptions.secure = true;
//     }
//     response.cookie('access_token', token, cookieOptions);
//   }
// }

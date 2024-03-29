// import {
//   MailProviders,
//   SendGridConfig,
//   SmtpConfig,
// } from '@@common/messaging/interfaces';
// import { RoleMenuPermission } from '../../common/prisma';
import { Request } from 'express';
import { JwtPayload as DefaultJwtPayload } from 'jwt-decode';

export const APP_NAME = 'Gomonji App';

export type RequiredPermission = [string, string];

// export type EmailProviderConfig = (SmtpConfig | SendGridConfig) & {
//   provider: MailProviders;
// };

export enum AuthStrategyType {
  JWT = 'jwt',
  HTTP_BEARER = 'http-bearer',
  PUBLIC = 'public',
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
  permittedFields?: any;
  selectFields?: any;
}

export interface RequestWithApp extends Request {
  user: JwtAppPayload;
  permittedFields?: any;
  selectFields?: any;
}

export interface JwtAppPayload {
  type: 'app';
  appName?: string;
  tenantName?: string;
  appId: string;
  tenantId: string;
  // schemaPermissions?: RoleMenuPermission[];
}

export interface JwtClientPayload {
  type: 'client';
  appName?: string;
  clientId: string;
}

export interface JwtPayload {
  type: 'user';
  userId: string;
  employeeId: string;
  email: string;
  name: string;
  appName?: string;
  tenantName: string;
  role: {
    code: string;
    // schemaPermissions: RoleMenuPermission[];
  };
  tenantId: string;
  branches: string[];
  contactId: string;
  departments: string[];
  sessionId: string;
  activeBranchId?: string;
}

export interface DecodedPayload extends DefaultJwtPayload {
  id: string;
  domain: string;
}

export interface SessionOptions {
  sessionType?: 'user' | 'app';
  tenantId?: string;
  userId?: string;
  activeBranchId?: string;
}

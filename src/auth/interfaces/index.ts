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
export interface JwtPayload {
  type: 'user';
  userId: string;
  email: string;
  name: string;
  role: {
    code: string;
    // schemaPermissions: RoleMenuPermission[];
  };
}

export interface DecodedPayload extends DefaultJwtPayload {
  id: string;
  domain: string;
}

export interface SessionOptions {
  sessionType?: 'user' | 'app';
  userId?: string;
}

import { Request } from 'express';
export interface RequestWithUser extends Request {
  user: JwtPayload;
  role: Role;
  permittedFields?: any;
  selectFields?: any;
}

export interface JwtPayload {
  userId: string;
  email: string;
  password: string;
}

export interface Role {
  name: string;
  code: string;
}

// export enum GenderEnum {
//   Male = "Male",
//   Female = "Female",
//   Unkwon = "Unknown",
// }

// export enum UserTypeEnum {
//   Person = "Person",
//   Organization = "Organization",
// }
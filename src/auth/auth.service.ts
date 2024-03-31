import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import bcrypt from 'bcrypt';
import { RequestWithUser } from './interfaces';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaClient,
  ) {}

  async signIn(
    dto: AuthCredentialsDto,
    req: RequestWithUser,
  ): Promise<{ token: string; user }> {
    const user = await this.prisma.user.findFirstOrThrow({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.updateUserLoginDetails(user, req);

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return { token, user };
  }

  private async updateUserLoginDetails(
    user: any,
    req: RequestWithUser,
  ): Promise<void> {
    const lastLoginIp = req.ip || req.connection.remoteAddress;

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
        lastLoginIp,
        passwordAttempt: (user.passwordAttempt || 0) + 1,
        ...(user.passwordAttempt === 4 && {
          passwordLockedAt: new Date(new Date().getTime() + 600000),
        }), // Add 10 minutes if it's the 5th attempt
      },
    });
  }

  async logout(res: Response): Promise<void> {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import bcrypt from 'bcrypt';
import { RequestWithUser } from './interfaces';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AppModule } from 'src/app.module';
import { NestFactory } from '@nestjs/core';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaClient,
  ) {}
  
  async signIn(dto: AuthCredentialsDto, req: RequestWithUser): Promise<{ token: string, user }> {
    // const app = await NestFactory.create(AppModule);
    // const configService = app.get<ConfigService>(ConfigService);

    const user = await this.prisma.user.findFirstOrThrow({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
      },
    });

    const lastLoginIp = req.ip || req.connection.remoteAddress;
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginIp,
      },
    });
  
    let passwordAttempt = user.passwordAttempt || 0;
    passwordAttempt += 1;

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordAttempt,
      },
    });

    // Update passwordLockedAt if 5th attempt
    if (passwordAttempt === 5) {
      const passwordLockedAt = new Date();
      passwordLockedAt.setMinutes(passwordLockedAt.getMinutes() + 10); // Add 10 minutes

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          passwordLockedAt,
        },
      });
    }

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    // const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' }); // Set refresh token expiration to 7 days

    // Set JWT as a cookie in the response
    // res.cookie('access_token', token, { httpOnly: true, secure: true });
    // res.cookie('refresh_token', refreshToken, { httpOnly: true, secure: true });
    // await redisClient.set(`access_token_${user.id}`, token, 'EX', 60 * 60 * 24 * 7); // Expire in 7 days

    return {
      token, 
      // refresh_token: refreshToken,
      user,
    };
  }

  async logout(res: Response): Promise<void> {
    // Clear cookies to logout
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}

import { BadRequestException, Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/auth-credential.dto';
import bcrypt from 'bcrypt';
import { RequestWithUser } from './interfaces';
import { PrismaClient, User } from '@prisma/client';
import { Response } from 'express';
import { AccessToken } from './types/Accesstoken';
import { RegisterUserDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaClient,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.prisma.user.findFirstOrThrow({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }

  async login({email, password}: LoginDto, req: User): Promise<AccessToken> {
    const user = await this.validateUser(email, password);
    const payload = { email: user.email, id: user.id }; 
    return { access_token: this.jwtService.sign(payload) };
  }

  async register({email, password}: RegisterUserDto): Promise<AccessToken> {
    const existingUser = this.prisma.user.findFirst({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.prisma.user.create({
      data: { 
        email, 
        password: hashedPassword },
    })
    return this.login({email, password}, newUser);
  }

  // async logout(res: Response): Promise<void> {
  //   res.clearCookie('access_token');
  //   res.clearCookie('refresh_token');
  // }
}

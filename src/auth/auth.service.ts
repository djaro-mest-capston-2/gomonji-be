import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/auth-credential.dto';
import bcrypt from 'bcrypt';
import { PrismaClient, User } from '@prisma/client';
import { RegisterUserDto } from './dto/signup.dto';
import { AccessToken } from './types/AccessToken';

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


  async login({ email, password }: LoginDto, req: User): Promise<AccessToken> {
    const user = await this.validateUser(email, password);
    const payload = { email: user.email, id: user.id };
    const access_token = this.jwtService.sign(payload);
    return { access_token, id: user.id };
  }
  

  async register(
    { email, password }: RegisterUserDto,
    req: User,
  ): Promise<AccessToken> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    return this.login({ email, password }, newUser);
  }
}

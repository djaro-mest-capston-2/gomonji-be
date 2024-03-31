import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  // Res,
  // UnauthorizedException,
  // UseGuards,
} from '@nestjs/common';
// import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
// import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { RequestWithUser } from './interfaces';
import { PrismaClient, User } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';
import { LoginDto } from './dto/auth-credential.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaClient,
    ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() req: User,
  ): Promise<any> {
    return this.authService.login(dto, req);
  }

  // @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() req: User): Promise<any> {
    const profile = await this.prisma.user.findFirstOrThrow({
      where: { id: req.id },
    })
    if (!profile) {
      throw new UnauthorizedException('User not found');
    }
    return profile;
  }
}

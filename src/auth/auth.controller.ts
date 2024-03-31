import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { RequestWithUser } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() dto: AuthCredentialsDto,
    @Req() req: RequestWithUser,
  ): Promise<any> {
    return this.authService.signIn(dto, req);
  }

  // @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: RequestWithUser): any {
    return req.user;
  }

  // @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Res() res: Response | any): Promise<any> {
    await this.authService.logout(res);
    return { message: 'Logged out successfully' };
  }
}

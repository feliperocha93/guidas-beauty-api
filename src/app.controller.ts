import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginRequest } from './interfaces/login-request.interface';

@ApiTags('App Controller')
@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  //TODO: Implements authenticate by swagger
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req: LoginRequest) {
    return this.authService.login(req.user);
  }

  @Get('/')
  test() {
    return 'Application is running!';
  }
}

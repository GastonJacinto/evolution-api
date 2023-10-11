import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Role } from 'src/common/roles.enum';
import { Auth } from './decorators/auth.decorator';
import { ActiveUser } from './decorators/active-user.decorator';
import { UserActiveInterface } from './interfaces/user-active.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signIn')
  signIn(@Body() credentials: LoginDto) {
    return this.authService.signIn(credentials);
  }
  @Get('profile')
  @Auth(Role.USER)
  profile(@ActiveUser() { email }: UserActiveInterface) {
    return this.authService.userProfile(email);
  }
}

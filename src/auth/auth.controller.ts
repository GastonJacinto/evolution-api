import { Controller, Post, Body, Get, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Role } from 'src/common/roles.enum';
import { Auth } from './decorators/auth.decorator';
import { ActiveUser } from './decorators/active-user.decorator';
import { UserActiveInterface } from './interfaces/user-active.interface';
import { UpdatePasswordDto } from 'src/users/dto/update-password.dto';

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

  @Patch('change/password')
  @Auth(Role.USER)
  changePassword(@Body() updatePassword: UpdatePasswordDto) {
    return this.authService.changePassword(updatePassword);
  }
}

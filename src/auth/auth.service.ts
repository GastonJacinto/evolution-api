/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserActiveInterface } from './interfaces/user-active.interface';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async signIn({ email, password }: LoginDto) {
    const userFound = await this.usersService.findForSignIn(email);
    if (!userFound) {
      throw new HttpException(
        'Usuario o contraseña inválidos.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    console.log(userFound);
    const isPasswordValid = await bcryptjs.compare(
      password,
      userFound.password,
    );
    if (!isPasswordValid) {
      throw new HttpException(
        'Usuario o contraseña inválidos.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload = { id: userFound.id, role: userFound.role };
    const token = await this.jwtService.signAsync(payload);
    return { token };
  }

  async userProfile(email: string) {
    return await this.usersService.findOneByEmail(email);
  }
}

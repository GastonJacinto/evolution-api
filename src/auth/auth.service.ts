/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserActiveInterface } from './interfaces/user-active.interface';
import { UpdatePasswordDto } from 'src/users/dto/update-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'mercadopago';
import { Repository } from 'typeorm';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async signIn({ email, password }: LoginDto) {
    const userFound = await this.usersService.findForSignIn(email);
    if (!userFound) {
      throw new HttpException(
        'Usuario o contraseña inválidos.',
        HttpStatus.UNAUTHORIZED,
      );
    }
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
  async changePassword(updatePassword: UpdatePasswordDto) {
    const userFound = await this.usersService.findForSignIn(
      updatePassword.email,
    );
    if (!userFound) {
      throw new HttpException(
        'Hubo un problema al actualizar tu contraseña.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const isPasswordValid = await bcryptjs.compare(
      updatePassword.actualPassword,
      userFound.password,
    );
    if (!isPasswordValid) {
      throw new HttpException(
        'Contraseña actual inválida.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const password = await bcryptjs.hash(updatePassword.newPassword, 10);
    const newPassword = {
      password,
    };
    await this.usersService.updateUser(userFound.id, newPassword);
    return {
      message: 'Contraseña actualizada con éxito. Cerrando sesión...',
    };
  }
}

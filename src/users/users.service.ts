/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcryptjs from 'bcryptjs';
import { create } from 'domain';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  //!POST METHODS
  async registerUser(createUserDto: CreateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: [{ email: createUserDto.email }, { dni: createUserDto.dni }],
    });
    if (userFound) {
      throw new BadRequestException(
        'El correo electrónico o el DNI ingresado ya existen.',
      );
    }
    const birthDate = new Date(createUserDto.birth);
    const today = new Date();
    const minBirthDate = new Date(
      today.getFullYear() - 13,
      today.getMonth(),
      today.getDate(),
    );

    if (birthDate < minBirthDate) {
      createUserDto.password = await bcryptjs.hash(createUserDto.password, 10);
      const newUser = this.userRepository.create(createUserDto);
      return await this.userRepository.save(newUser);
    } else {
      throw new HttpException(
        'Debes ser mayor de 13 años para registrarte.',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
  async addRemainingClasses(id: string, creditsToAdd: number) {
    const userFound = await this.userRepository.findOne({
      where: { id },
    });
    if (!userFound) {
      throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
    }
    userFound.remaining_classes = creditsToAdd;
    return await this.userRepository.save(userFound);
  }
  //!GET METHODS
  async findOneByEmail(email: string) {
    const userFound = await this.userRepository.findOne({
      where: { email },
    });
    if (!userFound) {
      throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
    }
    return userFound;
  }
  async findForSignIn(email: string) {
    const userFound = await this.userRepository.findOne({
      where: { email },
      select: ['email', 'id', 'password', 'role'],
    });
    if (!userFound) {
      throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
    }
    return userFound;
  }
  async findAll() {
    const users = await this.userRepository.find({ relations: ['classes'] });

    return users;
  }
  async findUserById(id: string) {
    const userFound = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoinAndSelect('user.classes', 'classes')
      .leftJoinAndSelect('classes.instructor', 'instructor')
      .addOrderBy('classes.date', 'ASC')
      .getOne();

    if (!userFound) {
      throw new HttpException(
        'No se ha encontrado al usuario.',
        HttpStatus.NOT_FOUND,
      );
    }

    return userFound;
  }
  async findWithDni(dni: string) {
    const userFound = await this.userRepository.findOne({
      where: { dni },
    });
    if (!userFound) {
      throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
    }
    return userFound;
  }

  //!UPDATE METHODS
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.userRepository.update(id, updateUserDto);
    } catch (error) {
      throw new Error(error);
    }
    return {
      message: 'Tus datos fueron actualizados con éxito.',
    };
  }
  //!DELETE METHODS
  async removeUser(id: number) {
    return await this.userRepository.softDelete(id);
  }
}

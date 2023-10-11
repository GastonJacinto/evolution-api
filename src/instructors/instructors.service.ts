/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  BadRequestException,
  BadGatewayException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Instructor } from './entities/instructor.entity';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { NotFoundError } from 'rxjs';

@Injectable()
export class InstructorsService {
  constructor(
    @InjectRepository(Instructor)
    private readonly instructorRepository: Repository<Instructor>,
  ) {}

  //!METODOS POST
  async registerInstructor(createInstructorDto: CreateInstructorDto) {
    const instructorFound = await this.instructorRepository.findOne({
      where: [
        { email: createInstructorDto.email },
        { dni: createInstructorDto.dni },
      ],
    });
    if (instructorFound) {
      throw new BadRequestException(
        'El correo electrónico o el DNI ingresado ya existen.',
      );
    }
    createInstructorDto.password = await bcryptjs.hash(
      createInstructorDto.password,
      10,
    );
    const newUser = this.instructorRepository.create(createInstructorDto);
    return await this.instructorRepository.save(newUser);
  }
  //!METODOS GET
  async findAll() {
    const instructorsFound = await this.instructorRepository.find({
      relations: ['classes'],
    });
    return instructorsFound;
  }

  async findInstructorById(id: string) {
    const instructorFound = await this.instructorRepository.findOne({
      where: { id },
      relations: ['classes'],
    });
    if (!instructorFound) {
      throw new HttpException('Instructor no encontrado', HttpStatus.NOT_FOUND);
    }
    return instructorFound;
  }

  updateInstructor(id: number, updateInstructorDto: UpdateInstructorDto) {
    return `This action updates a #${id} instructor`;
  }

  removeInstructor(id: number) {
    return `This action removes a #${id} instructor`;
  }
}

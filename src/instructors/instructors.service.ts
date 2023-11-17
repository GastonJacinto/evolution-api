/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Instructor } from './entities/instructor.entity';
import { Repository } from 'typeorm';
import { ActiveAccount } from 'src/common/active-account.enum';
import { EnableOrDisableEnum } from './types/types';
import { ClassesService } from 'src/classes/classes.service';

@Injectable()
export class InstructorsService {
  constructor(
    @InjectRepository(Instructor)
    private readonly instructorRepository: Repository<Instructor>,
    @Inject(forwardRef(() => ClassesService))
    private readonly classesService: ClassesService,
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

    const newUser = this.instructorRepository.create(createInstructorDto);
    return await this.instructorRepository.save(newUser);
  }
  async enableOrDisableInstructor(
    instructorId: string,
    action: EnableOrDisableEnum,
  ) {
    const instructorFound = await this.instructorRepository.findOne({
      where: {
        id: instructorId,
      },
    });
    if (instructorFound && action === EnableOrDisableEnum.ENABLE) {
      instructorFound.active = ActiveAccount.ACTIVE;
      await this.instructorRepository.save(instructorFound);
      return {
        message: 'Instructor habilitado.',
      };
    } else if (instructorFound && action === EnableOrDisableEnum.DISABLE) {
      instructorFound.active = ActiveAccount.INACTIVE;
      await this.instructorRepository.save(instructorFound);
      return {
        message: 'Instructor inhabilitado.',
      };
    } else {
      throw new BadRequestException(
        'Error al habilitar o inhabilitar al instructor.',
      );
    }
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

  async removeInstructor(id: string) {
    const instructorFound = await this.instructorRepository.findOne({
      where: { id },
      relations: ['classes'],
    });
    if (!instructorFound) {
      throw new HttpException('Instructor no encontrado', HttpStatus.NOT_FOUND);
    }
    await Promise.all(
      instructorFound.classes.map(async (clase) => {
        await this.classesService.removeInstructorFromClass(clase.id);
      }),
    );
    await this.instructorRepository.delete(id);
    return {
      message: `Instructor eliminado con éxito.`,
    };
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  BadRequestException,
  BadGatewayException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { OrderByCondition, Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';
import { User } from 'src/users/entities/user.entity';
import { Instructor } from 'src/instructors/entities/instructor.entity';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Instructor)
    private readonly instructorRepository: Repository<Instructor>,
  ) {}

  //!POST FUNCTIONS
  async createClass(createClassDto: CreateClassDto) {
    const newClass = await this.classRepository.create(createClassDto);
    return await this.classRepository.save(newClass);
  }
  async addStudentsToClass(classId: string, studentId: string) {
    const classFound = await this.findClassById(classId);
    const userFound = await this.userRepository.findOne({
      where: {
        id: studentId,
      },
    });
    let userInClass = false;
    classFound.students.forEach((user) => {
      if (user.id === userFound.id) {
        userInClass = true;
      }
    });
    if (userInClass) {
      throw new BadRequestException(
        'Usted ya se encuentra inscripto a esta clase.',
      );
    }
    userFound.remaining_classes -= 1;
    classFound.students.push(userFound);
    classFound.limit -= 1;
    await this.userRepository.save(userFound);
    return await this.classRepository.save(classFound);
  }
  async addInstructorToClass(classId: string, instructorId: string) {
    const classFound = await this.findClassById(classId);
    const instructorFound = await this.instructorRepository.findOne({
      where: {
        id: instructorId,
      },
    });
    if (!instructorFound) {
      throw new HttpException(
        'El instructor que quieres asignar no fue encontrado.',
        HttpStatus.NOT_FOUND,
      );
    }
    classFound.instructor = instructorFound;
    await this.classRepository.save(classFound);
    return {
      message: `La clase ${classFound.name} será dictada por ${instructorFound.name} ${instructorFound.lastname}.`,
    };
  }

  //!GET FUNCTIONS
  async findAllClasses() {
    const orderBy: OrderByCondition = { date: 'ASC' };
    const classesFound = await this.classRepository.find({
      relations: ['students', 'instructor'],
      order: orderBy,
    });
    return classesFound;
  }

  async findClassById(id: string) {
    const classFound = await this.classRepository.findOne({
      where: { id },
      relations: ['students', 'instructor'],
    });
    if (!classFound) {
      throw new HttpException('Clase no encontrada.', HttpStatus.NOT_FOUND);
    }
    return classFound;
  }
  //!UPDATE FUNCTIONS
  async updateClass(id: string, updateClassDto: UpdateClassDto) {
    const classFound = await this.findClassById(id);
    await this.classRepository.update(id, updateClassDto);
    return {
      message: `Los datos de la clase han sido actualizados.`,
    };
  }
  //!REMOVE FUNCTIONS
  async passToInactiveClass(id: string) {
    return await this.classRepository.softDelete(id);
  }
  async removeClass(id: string) {
    const classFound = await this.classRepository.delete(id);
    return {
      message: `Clase eliminada con éxito.`,
    };
  }

  async removeStudentFromClass(classId: string, studentId: string) {
    const classFound = await this.findClassById(classId);

    const userFound = await this.userRepository.findOneById(studentId);
    if (!userFound) {
      throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
    }
    classFound.students = classFound.students.filter(
      (student) => student.id !== studentId,
    );
    classFound.limit += 1;
    userFound.remaining_classes += 1;
    await this.userRepository.save(userFound);
    await this.classRepository.save(classFound);
    return {
      message: 'Reserva eliminada.',
    };
  }
  async removeInstructorFromClass(classId: string) {
    const classFound = await this.findClassById(classId);
    classFound.instructor = null;
    await this.classRepository.save(classFound);
    return {
      message: 'Se ha removido al instructor de esta clase.',
    };
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}
  //!METODOS GET
  @Get()
  findAll() {
    return this.classesService.findAllClasses();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classesService.findClassById(id);
  }
  //!METODOS PATCH
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.updateClass(id, updateClassDto);
  }

  //!METODOS POST
  @Post()
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.createClass(createClassDto);
  }
  @Post(':idClase/instructor/:idInstructor')
  addInstructorToClass(
    @Param('idClase') classId: string,
    @Param('idInstructor') instructorId: string,
  ) {
    return this.classesService.addInstructorToClass(classId, instructorId);
  }
  @Post(':idClase/student/:idStudent')
  addStudentsToClass(
    @Param('idClase') classId: string,
    @Param('idStudent') studentId: string,
  ) {
    return this.classesService.addStudentsToClass(classId, studentId);
  }
  //!METODOS DELETE
  @Delete(':id')
  removeClass(@Param('id') id: string) {
    return this.classesService.removeClass(id);
  }
  @Delete(':idClase/student/:idStudent')
  removeStudentFromClass(
    @Param('idClase') classId: string,
    @Param('idStudent') studentId: string,
  ) {
    return this.classesService.removeStudentFromClass(classId, studentId);
  }
  @Delete('/instructor/:id')
  removeInstructorFromClass(@Param('id') instructorId: string) {
    return this.classesService.removeInstructorFromClass(instructorId);
  }
}

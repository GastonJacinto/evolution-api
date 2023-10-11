import { Instructor } from 'src/instructors/entities/instructor.entity';

export class CreateClassDto {
  name: string;
  date: Date;
  limit: number;
  instructor?: Instructor;
}

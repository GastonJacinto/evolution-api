import { Module } from '@nestjs/common';
import { InstructorsService } from './instructors.service';
import { InstructorsController } from './instructors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Class } from 'src/classes/entities/class.entity';
import { Instructor } from './entities/instructor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Class, Instructor])],
  controllers: [InstructorsController],
  providers: [InstructorsService],
  exports: [TypeOrmModule],
})
export class InstructorsModule {}

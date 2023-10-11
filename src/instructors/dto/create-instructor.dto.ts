import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  MinLength,
} from 'class-validator';
import { Genre } from 'src/common/genres.enum';

export class CreateInstructorDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  lastname: string;
  @IsNotEmpty()
  birth: Date;
  @IsNotEmpty()
  @MinLength(8)
  password: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  phone: string;
  @IsNotEmpty()
  genre: Genre;
  @IsNotEmpty()
  @Length(8, 8)
  dni: string;
  @IsOptional()
  image?: string;
}

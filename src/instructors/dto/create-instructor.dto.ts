import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateInstructorDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  lastname: string;
  @IsNotEmpty()
  birth: Date;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @Length(8, 8)
  dni: string;
  @IsOptional()
  image?: string;
}

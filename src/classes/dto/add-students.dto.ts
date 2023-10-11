import { IsArray, IsString } from 'class-validator';

export class AddStudentsDto {
  @IsString({ each: true })
  @IsArray()
  users: string[];
}

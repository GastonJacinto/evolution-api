import { IsNotEmpty } from 'class-validator';

export class CreatePlanDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  image: string;
  @IsNotEmpty()
  price: number;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  credits: number;
}

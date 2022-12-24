import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateWorkDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDate()
  @IsNotEmpty()
  start: string;

  @IsDate()
  @IsNotEmpty()
  end: string;

  @IsNumber()
  @IsNotEmpty()
  projectId: number;
}

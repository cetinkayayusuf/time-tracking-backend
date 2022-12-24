import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';
import { Work } from '@prisma/client';

export class EditProjectDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

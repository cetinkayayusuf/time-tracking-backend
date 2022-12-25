import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class EditWorkDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  start?: string;

  @IsString()
  @IsOptional()
  end?: string;

  @IsNumber()
  @IsOptional()
  projectId?: number;
}

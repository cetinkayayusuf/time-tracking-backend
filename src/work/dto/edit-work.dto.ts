import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class EditWorkDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsDate()
  @IsOptional()
  start?: string;

  @IsDate()
  @IsOptional()
  end?: string;

  @IsNumber()
  @IsOptional()
  projectId?: number;
}

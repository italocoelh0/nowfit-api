import { IsString, IsNotEmpty, IsArray, IsNumber, IsObject, IsOptional } from 'class-validator';

export class UpdateRoutineDto {
  @IsString()
  @IsNotEmpty()
  type: 'none' | 'manual' | 'ai';

  @IsString()
  @IsNotEmpty()
  startDate: string;

  @IsNumber()
  duration: number;
  
  @IsArray()
  dailyRoutines: any[];
  
  @IsNumber()
  // FIX: 'IsOptional' was not defined. It is now imported.
  @IsOptional()
  targetWeight?: number;

  @IsNumber()
  // FIX: 'IsOptional' was not defined. It is now imported.
  @IsOptional()
  currentIMC?: number;
  
  @IsNumber()
  // FIX: 'IsOptional' was not defined. It is now imported.
  @IsOptional()
  targetIMC?: number;
}

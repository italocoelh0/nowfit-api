import { IsString, IsNumber, IsOptional, IsObject, IsArray } from 'class-validator';
import type { Sport, ActivitySplit } from '../types';

export class CreateActivityDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  sport: Sport;

  @IsNumber()
  distance: number;

  @IsNumber()
  time: number;

  @IsNumber()
  pace: number;

  @IsNumber()
  @IsOptional()
  elevationGain?: number;
  
  @IsNumber()
  @IsOptional()
  avgHeartRate?: number;
  
  @IsNumber()
  @IsOptional()
  maxHeartRate?: number;
  
  @IsString()
  @IsOptional()
  mapImageUrl?: string;
  
  @IsNumber()
  @IsOptional()
  effort?: number;
  
  // FIX: 'IsArray' was not defined. It is now imported.
  @IsArray()
  @IsOptional()
  splits?: ActivitySplit[];
}

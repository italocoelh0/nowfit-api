import { IsString, IsOptional, IsBoolean, IsNumber, IsArray, IsObject } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  userAvatar?: string;
  
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsBoolean()
  isProfilePublic?: boolean;

  @IsOptional()
  @IsNumber()
  weight?: number;
  
  @IsOptional()
  @IsNumber()
  height?: number;
  
  @IsOptional()
  @IsString()
  activityType?: string;
  
  @IsOptional()
  @IsArray()
  goals?: string[];
  
  @IsOptional()
  @IsArray()
  followingIds?: string[];
  
  @IsOptional()
  @IsObject()
  routine?: any;
  
  @IsOptional()
  @IsArray()
  activities?: any[];

  @IsOptional()
  @IsBoolean()
  skipFlameConfirmation?: boolean;
}

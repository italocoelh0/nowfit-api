import { IsString, IsOptional, IsUrl, IsNumber, IsBoolean } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @IsOptional()
  @IsNumber()
  originalPostId?: number;

  @IsOptional()
  @IsBoolean()
  isPriority?: boolean;
}
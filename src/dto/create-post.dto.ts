import { IsString, IsOptional, IsUrl, IsNumber, IsBoolean } from 'class-validator';

export class CreatePostDto {
  @IsString()
  content: string;

  @IsOptional()
  imageUrl?: string;

  @IsOptional()
  videoUrl?: string;

  @IsOptional()
  @IsNumber()
  originalPostId?: number;

  @IsOptional()
  @IsBoolean()
  isPriority?: boolean;
}

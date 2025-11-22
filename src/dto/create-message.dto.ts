import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  text?: string;

  @IsOptional()
  @IsUrl()
  audioUrl?: string;
}

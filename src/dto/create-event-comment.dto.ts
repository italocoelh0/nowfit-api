import { IsString, IsNotEmpty } from 'class-validator';

export class CreateEventCommentDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}
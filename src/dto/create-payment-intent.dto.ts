import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}

export class CreateCustomerDto {
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  name?: string;
}
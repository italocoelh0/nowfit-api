import { 
  IsArray, 
  IsNotEmpty, 
  IsNumber, 
  IsOptional, 
  IsString, 
  IsUrl, 
  Min, 
  ValidateNested, 
  ArrayMinSize 
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductDataDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

export class PriceDataDto {
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ValidateNested()
  @Type(() => ProductDataDto)
  @IsNotEmpty()
  product_data: ProductDataDto;

  @IsNumber()
  @Min(1)
  unit_amount: number; // Em centavos (ex: R$ 10,00 = 1000)
}

export class LineItemDto {
  @ValidateNested()
  @Type(() => PriceDataDto)
  price_data: PriceDataDto;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateCheckoutDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => LineItemDto)
  lineItems: LineItemDto[];

  @IsOptional()
  @IsUrl()
  successUrl?: string;

  @IsOptional()
  @IsUrl()
  cancelUrl?: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  customerEmail?: string;

  @IsOptional()
  mode?: 'payment' | 'subscription' | 'setup';

  @IsOptional()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsString()
  paymentMethodTypes?: string;

  @IsOptional()
  @IsString()
  clientReferenceId?: string;

  @IsOptional()
  allowPromotionCodes?: boolean;

  @IsOptional()
  billingAddressCollection?: 'required' | 'auto';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  shippingAddressCollection?: {
    allowedCountries: string[];
  };
}
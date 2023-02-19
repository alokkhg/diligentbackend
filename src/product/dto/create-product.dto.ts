import { IsCurrency, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsCurrency()
  price: number;

  @IsOptional()
  description: string;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min } from 'class-validator';

export class CreateOrderDetailDto {
  @ApiProperty({ example: 1, description: 'ID del producto' })
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty({ example: 24999.99, description: 'Precio al momento de la compra' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiPropertyOptional({ example: 'LAP-X500-BLK' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;

  @ApiProperty({ example: 2, description: 'Cantidad de unidades' })
  @IsInt()
  @Min(1)
  quantity: number;
}
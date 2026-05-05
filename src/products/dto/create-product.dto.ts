import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray, IsInt, IsNotEmpty, IsNumber,
  IsOptional, IsPositive, IsString, MaxLength, Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Laptop Gamer X500' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ example: 'Laptop de alto rendimiento con RTX 4070' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ example: 24999.99, description: 'Precio del producto' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiPropertyOptional({ example: 'LAP-X500-BLK', description: 'Código SKU único' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;

  @ApiPropertyOptional({ example: 15, description: 'Unidades en stock' })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({ example: '/img/laptop-x500.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  thumbnail?: string;

  @ApiPropertyOptional({ example: [1, 2], description: 'IDs de categorías', type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categoryIds?: number[];

  @ApiPropertyOptional({ example: [1, 3], description: 'IDs de opciones', type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  optionIds?: number[];
}
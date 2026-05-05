import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray, IsInt, IsNumber, IsOptional,
  IsPositive, IsString, MaxLength, Min,
} from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Laptop Gamer X500 Pro' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ example: 'Descripción actualizada' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ example: 22999.99 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price?: number;

  @ApiPropertyOptional({ example: 'LAP-X500-PRO' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({ example: '/img/nueva.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  thumbnail?: string;

  @ApiPropertyOptional({ example: [1], type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categoryIds?: number[];

  @ApiPropertyOptional({ example: [2], type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  optionIds?: number[];
}
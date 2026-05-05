import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Ropa' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({ example: 'Prendas de vestir' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({ example: '/img/ropa.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  thumbnail?: string;
}
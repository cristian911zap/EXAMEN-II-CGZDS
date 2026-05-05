import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateOptionDto {
  @ApiPropertyOptional({ example: 'Talla' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  option_name?: string;
}
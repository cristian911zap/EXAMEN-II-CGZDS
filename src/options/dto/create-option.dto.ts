import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateOptionDto {
  @ApiProperty({ example: 'Color', description: 'Nombre de la opción de producto' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  option_name: string;
}
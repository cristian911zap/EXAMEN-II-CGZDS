import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'nuevo@correo.com' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(200)
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  full_name: string;

  @ApiPropertyOptional({ example: 'Av. Siempre Viva 123' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  billing_address?: string;

  @ApiPropertyOptional({ example: 'Calle Falsa 456' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  default_shipping_address?: string;

  @ApiPropertyOptional({ example: 'México' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional({ example: '+52 492 123 4567' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}
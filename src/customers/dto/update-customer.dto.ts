import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCustomerDto {
  @ApiPropertyOptional({ example: 'nuevo@correo.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(200)
  email?: string;

  @ApiPropertyOptional({ example: 'nuevapassword', minLength: 6 })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({ example: 'Juan Actualizado' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  full_name?: string;

  @ApiPropertyOptional({ example: 'Nueva dirección facturación' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  billing_address?: string;

  @ApiPropertyOptional({ example: 'Nueva dirección envío' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  default_shipping_address?: string;

  @ApiPropertyOptional({ example: 'Argentina' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional({ example: '+52 492 987 6543' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}
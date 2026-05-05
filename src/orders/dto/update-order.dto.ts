import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class UpdateOrderDto {
  @ApiPropertyOptional({ example: 'Nueva dirección de envío' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  shipping_address?: string;

  @ApiPropertyOptional({ example: 'Nueva dirección de orden' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  order_adress?: string;

  @ApiPropertyOptional({ example: 'nuevo@correo.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(200)
  order_email?: string;

  @ApiPropertyOptional({ enum: OrderStatus, example: OrderStatus.SHIPPED })
  @IsOptional()
  @IsEnum(OrderStatus)
  order_status?: OrderStatus;
}
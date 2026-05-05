import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray, IsEmail, IsEnum, IsNotEmpty,
  IsOptional, IsString, MaxLength, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../entities/order.entity';
import { CreateOrderDetailDto } from './create-order-detail.dto';

export class CreateOrderDto {
  @ApiPropertyOptional({ example: 'Calle Falsa 123, CDMX' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  shipping_address?: string;

  @ApiPropertyOptional({ example: 'Av. Reforma 500, CDMX' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  order_adress?: string;

  @ApiPropertyOptional({ example: 'cliente@correo.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(200)
  order_email?: string;

  @ApiPropertyOptional({ enum: OrderStatus, example: OrderStatus.PENDING })
  @IsOptional()
  @IsEnum(OrderStatus)
  order_status?: OrderStatus;

  @ApiProperty({
    type: [CreateOrderDetailDto],
    description: 'Líneas de detalle de la orden',
    example: [{ productId: 1, price: 24999.99, sku: 'LAP-X500', quantity: 1 }],
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailDto)
  details: CreateOrderDetailDto[];
}
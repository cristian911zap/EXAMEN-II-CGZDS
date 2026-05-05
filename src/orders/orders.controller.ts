import {
  Body, Controller, Delete, Get, Param,
  ParseIntPipe, Patch, Post, UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth, ApiForbiddenResponse, ApiOperation,
  ApiResponse, ApiTags, ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../auth/enums/role.enum';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Listar órdenes',
    description: 'ADMIN y DEVELOPER ven todas las órdenes. USER ve solo sus propias órdenes.',
  })
  @ApiResponse({ status: 200, description: 'Lista de órdenes' })
  @ApiUnauthorizedResponse({ description: 'Token no proporcionado o inválido' })
  findAll(@CurrentUser() user: any) {
    if (user.role === Role.ADMIN || user.role === Role.DEVELOPER) {
      return this.ordersService.findAll();
    }
    return this.ordersService.findByCustomer(user.id);
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Obtener orden por ID', description: 'Incluye detalles y productos.' })
  @ApiResponse({ status: 200, description: 'Orden encontrada con detalles' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  @ApiUnauthorizedResponse({ description: 'Token no proporcionado o inválido' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Crear orden',
    description: 'El customer_id se extrae del token. El ammount se calcula automáticamente sumando price * quantity de cada detalle.',
  })
  @ApiResponse({ status: 201, description: 'Orden creada con sus detalles' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiUnauthorizedResponse({ description: 'Token no proporcionado o inválido' })
  create(@Body() dto: CreateOrderDto, @CurrentUser() user: any) {
    return this.ordersService.create(dto, user.id);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @Roles(Role.DEVELOPER, Role.ADMIN)
  @ApiOperation({
    summary: 'Actualizar orden',
    description: 'Solo DEVELOPER y ADMIN. Permite cambiar estado, direcciones y email. Los detalles no se modifican por este endpoint.',
  })
  @ApiResponse({ status: 200, description: 'Orden actualizada' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  @ApiUnauthorizedResponse({ description: 'Token no proporcionado o inválido' })
  @ApiForbiddenResponse({ description: 'Solo DEVELOPER o ADMIN pueden acceder' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Eliminar orden', description: 'Solo ADMIN. Elimina la orden y sus detalles en cascada.' })
  @ApiResponse({ status: 200, description: 'Orden eliminada' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  @ApiUnauthorizedResponse({ description: 'Token no proporcionado o inválido' })
  @ApiForbiddenResponse({ description: 'Solo ADMIN puede acceder' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }
}
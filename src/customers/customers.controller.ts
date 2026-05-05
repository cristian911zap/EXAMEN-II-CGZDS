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
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@ApiTags('Customers')
@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Listar clientes', description: 'ADMIN y DEVELOPER ven todos. USER ve solo su perfil.' })
  @ApiResponse({ status: 200, description: 'Lista de clientes o perfil propio' })
  @ApiUnauthorizedResponse({ description: 'Token no proporcionado o inválido' })
  findAll(@CurrentUser() user: any) {
    if (user.role === Role.ADMIN || user.role === Role.DEVELOPER) {
      return this.customersService.findAll();
    }
    return this.customersService.findOne(user.id);
  }

  @Post()
  @ApiBearerAuth('access-token')
  @Roles(Role.DEVELOPER)
  @ApiOperation({ summary: 'Crear cliente', description: 'Solo DEVELOPER.' })
  @ApiResponse({ status: 201, description: 'Cliente creado' })
  @ApiUnauthorizedResponse({ description: 'Token no proporcionado o inválido' })
  @ApiForbiddenResponse({ description: 'Solo DEVELOPER puede acceder' })
  create(@Body() dto: CreateCustomerDto) {
    return this.customersService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @Roles(Role.DEVELOPER)
  @ApiOperation({ summary: 'Actualizar cliente', description: 'Solo DEVELOPER.' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @ApiUnauthorizedResponse({ description: 'Token no proporcionado o inválido' })
  @ApiForbiddenResponse({ description: 'Solo DEVELOPER puede acceder' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCustomerDto) {
    return this.customersService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Eliminar cliente', description: 'Solo ADMIN.' })
  @ApiResponse({ status: 200, description: 'Cliente eliminado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @ApiUnauthorizedResponse({ description: 'Token no proporcionado o inválido' })
  @ApiForbiddenResponse({ description: 'Solo ADMIN puede acceder' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.remove(id);
  }

  @Patch(':id/make-admin')
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Promover a ADMIN', description: 'Solo ADMIN.' })
  @ApiResponse({ status: 200, description: 'Rol actualizado a ADMIN' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @ApiUnauthorizedResponse({ description: 'Token no proporcionado o inválido' })
  @ApiForbiddenResponse({ description: 'Solo ADMIN puede acceder' })
  makeAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.makeAdmin(id);
  }

  @Patch(':id/make-developer')
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Promover a DEVELOPER', description: 'Solo ADMIN puede promover a otro usuario a DEVELOPER.' })
  @ApiResponse({ status: 200, description: 'Rol actualizado a DEVELOPER' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @ApiUnauthorizedResponse({ description: 'Token no proporcionado o inválido' })
  @ApiForbiddenResponse({ description: 'Solo ADMIN puede acceder' })
  makeDeveloper(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.makeDeveloper(id);
  }
}
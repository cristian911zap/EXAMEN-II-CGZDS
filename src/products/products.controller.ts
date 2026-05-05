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
import { Role } from '../auth/enums/role.enum';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Listar productos', description: 'Incluye categorías y opciones.' })
  @ApiResponse({ status: 200, description: 'Lista de productos' })
  @ApiUnauthorizedResponse({ description: 'Token no proporcionado o inválido' })
  findAll() { return this.productsService.findAll(); }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiUnauthorizedResponse({ description: 'Token no proporcionado o inválido' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.productsService.findOne(id); }

  @Post()
  @ApiBearerAuth('access-token')
  @Roles(Role.DEVELOPER, Role.ADMIN)
  @ApiOperation({ summary: 'Crear producto', description: 'Solo DEVELOPER y ADMIN. Se pueden asignar categorías y opciones por ID.' })
  @ApiResponse({ status: 201, description: 'Producto creado' })
  @ApiUnauthorizedResponse({ description: 'Token no proporcionado o inválido' })
  @ApiForbiddenResponse({ description: 'Solo DEVELOPER o ADMIN pueden acceder' })
  create(@Body() dto: CreateProductDto) { return this.productsService.create(dto); }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @Roles(Role.DEVELOPER, Role.ADMIN)
  @ApiOperation({ summary: 'Actualizar producto', description: 'Solo DEVELOPER y ADMIN. Enviar categoryIds: [] o optionIds: [] para limpiar relaciones.' })
  @ApiResponse({ status: 200, description: 'Producto actualizado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiUnauthorizedResponse({ description: 'Token no proporcionado o inválido' })
  @ApiForbiddenResponse({ description: 'Solo DEVELOPER o ADMIN pueden acceder' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) { return this.productsService.update(id, dto); }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Eliminar producto', description: 'Solo ADMIN.' })
  @ApiResponse({ status: 200, description: 'Producto eliminado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiUnauthorizedResponse({ description: 'Token no proporcionado o inválido' })
  @ApiForbiddenResponse({ description: 'Solo ADMIN puede acceder' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.productsService.remove(id); }
}
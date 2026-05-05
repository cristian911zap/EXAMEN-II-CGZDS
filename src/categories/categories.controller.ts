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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Listar categorías' })
  @ApiResponse({ status: 200, description: 'Lista de categorías' })
  @ApiUnauthorizedResponse({ description: 'Token no proporcionado o inválido' })
  findAll() { return this.categoriesService.findAll(); }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Obtener categoría por ID' })
  @ApiResponse({ status: 200, description: 'Categoría encontrada' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  @ApiUnauthorizedResponse({ description: 'Token no proporcionado o inválido' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.categoriesService.findOne(id); }

  @Post()
  @ApiBearerAuth('access-token')
  @Roles(Role.DEVELOPER, Role.ADMIN)
  @ApiOperation({ summary: 'Crear categoría', description: 'Solo DEVELOPER y ADMIN.' })
  @ApiResponse({ status: 201, description: 'Categoría creada' })
  @ApiUnauthorizedResponse({ description: 'Token no proporcionado o inválido' })
  @ApiForbiddenResponse({ description: 'Solo DEVELOPER o ADMIN pueden acceder' })
  create(@Body() dto: CreateCategoryDto) { return this.categoriesService.create(dto); }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @Roles(Role.DEVELOPER, Role.ADMIN)
  @ApiOperation({ summary: 'Actualizar categoría', description: 'Solo DEVELOPER y ADMIN.' })
  @ApiResponse({ status: 200, description: 'Categoría actualizada' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  @ApiUnauthorizedResponse({ description: 'Token no proporcionado o inválido' })
  @ApiForbiddenResponse({ description: 'Solo DEVELOPER o ADMIN pueden acceder' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) { return this.categoriesService.update(id, dto); }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Eliminar categoría', description: 'Solo ADMIN.' })
  @ApiResponse({ status: 200, description: 'Categoría eliminada' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  @ApiUnauthorizedResponse({ description: 'Token no proporcionado o inválido' })
  @ApiForbiddenResponse({ description: 'Solo ADMIN puede acceder' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.categoriesService.remove(id); }
}
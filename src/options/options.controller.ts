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
import { OptionsService } from './options.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';

@ApiTags('Options')
@Controller('options')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Listar opciones de producto' })
  @ApiResponse({ status: 200, description: 'Lista de opciones' })
  @ApiUnauthorizedResponse({ description: 'Token no proporcionado o inválido' })
  findAll() { return this.optionsService.findAll(); }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Obtener opción por ID' })
  @ApiResponse({ status: 200, description: 'Opción encontrada' })
  @ApiResponse({ status: 404, description: 'Opción no encontrada' })
  @ApiUnauthorizedResponse({ description: 'Token no proporcionado o inválido' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.optionsService.findOne(id); }

  @Post()
  @ApiBearerAuth('access-token')
  @Roles(Role.DEVELOPER, Role.ADMIN)
  @ApiOperation({ summary: 'Crear opción', description: 'Solo DEVELOPER y ADMIN.' })
  @ApiResponse({ status: 201, description: 'Opción creada' })
  @ApiUnauthorizedResponse({ description: 'Token no proporcionado o inválido' })
  @ApiForbiddenResponse({ description: 'Solo DEVELOPER o ADMIN pueden acceder' })
  create(@Body() dto: CreateOptionDto) { return this.optionsService.create(dto); }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @Roles(Role.DEVELOPER, Role.ADMIN)
  @ApiOperation({ summary: 'Actualizar opción', description: 'Solo DEVELOPER y ADMIN.' })
  @ApiResponse({ status: 200, description: 'Opción actualizada' })
  @ApiResponse({ status: 404, description: 'Opción no encontrada' })
  @ApiUnauthorizedResponse({ description: 'Token no proporcionado o inválido' })
  @ApiForbiddenResponse({ description: 'Solo DEVELOPER o ADMIN pueden acceder' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOptionDto) { return this.optionsService.update(id, dto); }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Eliminar opción', description: 'Solo ADMIN.' })
  @ApiResponse({ status: 200, description: 'Opción eliminada' })
  @ApiResponse({ status: 404, description: 'Opción no encontrada' })
  @ApiUnauthorizedResponse({ description: 'Token no proporcionado o inválido' })
  @ApiForbiddenResponse({ description: 'Solo ADMIN puede acceder' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.optionsService.remove(id); }
}
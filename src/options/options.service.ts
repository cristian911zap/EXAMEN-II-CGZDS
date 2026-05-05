import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Option } from './entities/option.entity';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';

@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(Option)
    private readonly repo: Repository<Option>,
  ) {}

  findAll(): Promise<Option[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Option> {
    const option = await this.repo.findOne({ where: { id } });
    if (!option) throw new NotFoundException(`Option #${id} not found`);
    return option;
  }

  create(dto: CreateOptionDto): Promise<Option> {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateOptionDto): Promise<Option> {
    const option = await this.findOne(id);
    Object.assign(option, dto);
    return this.repo.save(option);
  }

  async remove(id: number): Promise<void> {
    await this.repo.remove(await this.findOne(id));
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { Option } from '../options/entities/option.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private readonly RELATIONS = ['categories', 'options'];

  constructor(
    @InjectRepository(Product) private readonly repo: Repository<Product>,
    @InjectRepository(Category) private readonly categoriesRepo: Repository<Category>,
    @InjectRepository(Option) private readonly optionsRepo: Repository<Option>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.repo.find({ relations: this.RELATIONS });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.repo.findOne({ where: { id }, relations: this.RELATIONS });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const { categoryIds, optionIds, ...rest } = dto;
    const product = this.repo.create(rest);

    if (categoryIds?.length) {
      product.categories = await this.categoriesRepo.findBy({ id: In(categoryIds) });
    }
    if (optionIds?.length) {
      product.options = await this.optionsRepo.findBy({ id: In(optionIds) });
    }

    return this.repo.save(product);
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    const { categoryIds, optionIds, ...rest } = dto;

    Object.assign(product, rest);

    if (categoryIds !== undefined) {
      product.categories = categoryIds.length
        ? await this.categoriesRepo.findBy({ id: In(categoryIds) })
        : [];
    }
    if (optionIds !== undefined) {
      product.options = optionIds.length
        ? await this.optionsRepo.findBy({ id: In(optionIds) })
        : [];
    }

    return this.repo.save(product);
  }

  async remove(id: number): Promise<void> {
    await this.repo.remove(await this.findOne(id));
  }
}
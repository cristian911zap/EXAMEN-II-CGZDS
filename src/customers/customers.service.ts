import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Customer } from './entities/customer.entity';
import { Role } from '../auth/enums/role.enum';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly repo: Repository<Customer>,
  ) {}

  findAll(): Promise<Customer[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.repo.findOne({ where: { id } });
    if (!customer) throw new NotFoundException(`Customer #${id} not found`);
    return customer;
  }

  findByEmail(email: string): Promise<Customer | null> {
    return this.repo
      .createQueryBuilder('c')
      .addSelect('c.password')
      .where('c.email = :email', { email })
      .getOne();
  }

  createInternal(data: Partial<Customer>): Promise<Customer> {
    return this.repo.save(this.repo.create(data));
  }

  async create(dto: CreateCustomerDto): Promise<Customer> {
    const existing = await this.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);
    return this.createInternal({ ...dto, password: hashed, role: Role.USER });
  }

  async update(id: number, dto: UpdateCustomerDto): Promise<Customer> {
    await this.findOne(id);

    const updateData: Partial<Customer> = { ...dto };

    if (dto.email) {
      const conflict = await this.findByEmail(dto.email);
      if (conflict && conflict.id !== id)
        throw new ConflictException('Email already registered');
    }
    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    await this.repo.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const customer = await this.findOne(id);
    await this.repo.remove(customer);
  }

  async makeAdmin(id: number): Promise<Customer> {
    await this.findOne(id);
    await this.repo.update(id, { role: Role.ADMIN });
    return this.findOne(id);
  }

  async makeDeveloper(id: number): Promise<Customer> {
  await this.findOne(id);
  await this.repo.update(id, { role: Role.DEVELOPER });
  return this.findOne(id);
  }

  async seedAdmin(): Promise<void> {
    const existing = await this.findByEmail('admin@admin.com');
    if (!existing) {
      const hashed = await bcrypt.hash('admin123', 10);
      await this.createInternal({
        full_name: 'Administrator',
        email: 'admin@admin.com',
        password: hashed,
        role: Role.ADMIN,
      });
      console.log('Admin creado — email: admin@admin.com / password: admin123 (¡cámbialo!)');
    }
  }
}
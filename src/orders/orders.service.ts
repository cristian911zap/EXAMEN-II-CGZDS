import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  private readonly RELATIONS = ['customer', 'details', 'details.product'];

  constructor(
    @InjectRepository(Order) private readonly ordersRepo: Repository<Order>,
    @InjectRepository(OrderDetail) private readonly detailsRepo: Repository<OrderDetail>,
  ) {}

  findAll(): Promise<Order[]> {
    return this.ordersRepo.find({ relations: this.RELATIONS });
  }

  findByCustomer(customerId: number): Promise<Order[]> {
    return this.ordersRepo.find({
      where: { customerId },
      relations: this.RELATIONS,
      order: { order_date: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepo.findOne({ where: { id }, relations: this.RELATIONS });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }

  async create(dto: CreateOrderDto, customerId: number): Promise<Order> {
    const { details, ...rest } = dto;

    // Calcular el total sumando price * quantity de cada línea
    const ammount = details.reduce(
      (sum, d) => sum + d.price * d.quantity,
      0,
    );

    const order = this.ordersRepo.create({
      ...rest,
      customerId,
      ammount: parseFloat(ammount.toFixed(2)),
      details: details.map((d) => this.detailsRepo.create(d)),
    });

    return this.ordersRepo.save(order);
  }

  async update(id: number, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, dto);
    return this.ordersRepo.save(order);
  }

  async remove(id: number): Promise<void> {
    await this.ordersRepo.remove(await this.findOne(id));
  }
}
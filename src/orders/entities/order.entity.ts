import {
  Column, Entity, JoinColumn, ManyToOne,
  OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { OrderDetail } from './order-detail.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity('Orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'customer_id' })
  customerId: number;

  @ManyToOne(() => Customer, (customer) => customer.orders, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  ammount: number;

  @Column({ length: 255, nullable: true })
  shipping_address: string;

  @Column({ length: 255, nullable: true })
  order_adress: string;

  @Column({ length: 200, nullable: true })
  order_email: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  order_date: Date;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  order_status: OrderStatus;

  @OneToMany(() => OrderDetail, (detail) => detail.order, {
    cascade: true,
    eager: false,
  })
  details: OrderDetail[];
}
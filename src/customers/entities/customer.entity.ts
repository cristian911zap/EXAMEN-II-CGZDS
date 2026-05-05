import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../auth/enums/role.enum';
import { Order } from '../../orders/entities/order.entity';

@Entity('Customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200, unique: true })
  email: string;

  @Column({ length: 255, select: false })
  password: string;

  @Column({ length: 255 })
  full_name: string;

  @Column({ length: 255, nullable: true })
  billing_address: string;

  @Column({ length: 255, nullable: true })
  default_shipping_address: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
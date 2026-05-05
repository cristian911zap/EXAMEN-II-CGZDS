import {
  Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Option } from '../../options/entities/option.entity';

@Entity('Products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ length: 100, nullable: true, unique: true })
  sku: string;

  @Column({ default: 0 })
  stock: number;

  @Column({ length: 255, nullable: true })
  thumbnail: string;

  // Relación con Categories a través de product_categories
  @ManyToMany(() => Category, { eager: false })
  @JoinTable({
    name: 'product_categories',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  // Relación con Options a través de product_options
  @ManyToMany(() => Option, { eager: false })
  @JoinTable({
    name: 'product_options',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'option_id', referencedColumnName: 'id' },
  })
  options: Option[];
}
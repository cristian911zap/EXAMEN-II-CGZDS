import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  name: string;

  @Column({ length: 255, nullable: true })
  description: string;

  @Column({ length: 255, nullable: true })
  thumbnail: string;
}
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Options')
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  option_name: string;
}
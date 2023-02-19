import { Exclude } from '@nestjs/class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200, unique: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ type: 'integer' })
  price: number;

  @Column('integer', { default: 0 })
  view_count: number;

  @Column('boolean')
  @Exclude({ toPlainOnly: true })
  active: boolean;
}

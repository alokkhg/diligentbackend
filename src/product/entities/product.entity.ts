import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column('text')
  description: string;

  @Column({ type: 'integer' })
  price: number;

  @Column('integer', { default: 0 })
  view_count: number;

  @Column('boolean')
  active: boolean;
}

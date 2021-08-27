import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { PaymentVia } from '../utils/via.enum';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  userHash: string;

  @Column({ type: 'float' })
  originalAmount: number;

  @Column({ type: 'float' })
  clientAmount: number;

  @Column({ nullable: true })
  channel: string;

  @Column({
    type: 'enum',
    enum: PaymentVia,
    nullable: true,
  })
  via: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Product, (product) => product.payments)
  product: Product;

  constructor(partial: Partial<Payment>) {
    Object.assign(this, partial);
  }
}

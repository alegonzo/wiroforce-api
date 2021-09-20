import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Application } from '../../application/entities/application.entity';
import { Payment } from '../../payment/entities/payment.entity';

@Entity()
export class Product {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  itemId: string;

  @ApiProperty()
  @Column()
  price: number;

  @ApiProperty()
  @Column({ default: null, nullable: true })
  description: string;

  @ApiProperty()
  @Column({ default: null, nullable: true })
  resourceAmount: string;

  @ApiProperty()
  @Column({ default: null, nullable: true })
  imageUrl: string;

  @ApiProperty()
  @Column()
  active: boolean;

  @ApiProperty()
  @Column({ default: false })
  offline: boolean;

  @ApiProperty()
  @Column()
  version: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  applicationId: number;

  @ManyToOne((type) => Application, (application) => application.products)
  application: Application;

  @OneToMany(() => Payment, (payment) => payment.product)
  payments: Payment[];

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { type } from 'os';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class Application {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  token: string;

  @ApiProperty()
  @Column()
  appId: string;

  @ApiProperty()
  @Column()
  imageUrl: string;

  @ApiProperty()
  @Column({
    default: false,
  })
  active: boolean;

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
  companyId: number;

  @ApiProperty({ type: () => Company })
  @ManyToOne(() => Company, (company) => company.applications)
  company: Company;

  @OneToMany((type) => Product, (product) => product.application)
  products: Product[];

  constructor(partial: Partial<Application>) {
    Object.assign(this, partial);
  }
}

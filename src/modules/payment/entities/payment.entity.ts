import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../../product/entities/product.entity";
import { PaymentVia } from "../utils/via.enum";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userHash: string;

    @Column()
    totalAmount: number;

    @Column()
    clientAmount: number;

    @Column()
    platformAmount: number;

    @Column({ nullable: true })
    channel: string;

    @Column({
        type: 'enum',
        enum: PaymentVia,
        nullable: true
    })
    via: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Product, product => product.payments)
    product: Product;

    constructor(partial: Partial<Payment>) {
        Object.assign(this, partial);
    }

}
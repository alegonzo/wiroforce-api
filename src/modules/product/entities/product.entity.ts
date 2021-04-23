import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    itemId: string;

    @Column()
    price: number;

    @Column()
    description: string;

    @Column()
    resourceAmount: string;

    @Column()
    imageUrl: string;

    @Column()
    active: boolean;

    @Column()
    offline: boolean;

    @Column()
    version: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

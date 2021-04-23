import { type } from "os";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Application } from "../../application/entities/application.entity";

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

    @Column({
        nullable: true
    })
    applicationId: number;

    @ManyToOne(type => Application, application => application.products)
    application: Application;

    constructor(partial: Partial<Product>) {
        Object.assign(this, partial);
    }
}

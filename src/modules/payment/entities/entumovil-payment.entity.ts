import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class EntumovilPayment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    msgId: string;

    @Column()
    body: string;

    @Column()
    phoneSender: string;

    @Column()
    entumovilPhone: string;
    
    @CreateDateColumn()
    createdAt: Date;

    constructor(partial: Partial<EntumovilPayment>) {
        Object.assign(this, partial);
    }

}
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Application {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    token: string;

    @Column()
    appId: string;

    @Column()
    imageUrl: string;

    @Column({
        default: true
    })
    active: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

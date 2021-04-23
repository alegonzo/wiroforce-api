import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Application } from "../../application/entities/application.entity";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => User, user => user.company)
    users: User;

    @OneToMany(() => Application, application => application.company)
    applications: Application[];

    constructor(partial: Partial<Company>) {
        Object.assign(this, partial);
    }
}
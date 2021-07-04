import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Application } from "../../application/entities/application.entity";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Company {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    name: string;

    @OneToMany(() => User, user => user.company)
    users: User;

    @OneToMany(() => Application, application => application.company)
    applications: Application[];

    constructor(partial: Partial<Company>) {
        Object.assign(this, partial);
    }
}
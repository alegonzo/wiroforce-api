import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Company } from "../../company/entities/company.entity";
import { Role } from "../enums/role.enum";
import { Profile } from "./profile.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    fullName: string;

    @Column({
        default: false
    })
    active: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({
        type: 'enum',
        enum: Role,
        nullable: true
    })
    role: Role;

    @Column()
    companyId: number;

    @ManyToOne(() => Company, company => company.users)
    company: Company;

    @OneToOne(() => Profile, {
        cascade: true
    })
    @JoinColumn()
    profile: Profile;

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}

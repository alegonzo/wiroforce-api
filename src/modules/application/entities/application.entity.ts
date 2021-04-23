import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Company } from "../../company/entities/company.entity";
import { Product } from "../../product/entities/product.entity";

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

    @Column({
        nullable: true
    })
    companyId: number;

    @ManyToOne(() => Company, company => company.applications)
    company: Company;

    @OneToMany(type => Product, product => product.application)
    products: Product[];

    constructor(partial: Partial<Application>) {
        Object.assign(this, partial);
    }
}

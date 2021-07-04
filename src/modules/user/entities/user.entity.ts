import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../auth/enums/role.enum';
import { Company } from '../../company/entities/company.entity';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column({
    default: false,
  })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CLIENT,
  })
  roles: Role;

  @Column({
    nullable: true
  })
  companyId: number;

  @ManyToOne(() => Company, (company) => company.users, {
    nullable: true
  })
  company: Company;

  @OneToOne(() => Profile, {
    cascade: true,
    nullable: true
  })
  @JoinColumn()
  profile: Profile;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

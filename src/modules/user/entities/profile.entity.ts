import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Province } from '../enums/province.enum';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  phone: string;

  @Column({ default: null })
  address: string;

  @Column({ default: null })
  license: string;

  @Column({ default: null })
  nitOnat: string;

  @Column({
    type: 'enum',
    enum: Province,
    nullable: true,
  })
  province: Province;

  constructor(partial: Partial<Profile>) {
    Object.assign(this, partial);
  }
}

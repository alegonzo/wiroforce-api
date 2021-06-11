import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Province } from '../enums/province.enum';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  license: string;

  @Column()
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

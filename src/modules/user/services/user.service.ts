import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyService } from '../../company/services/company.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private companyService: CompanyService
  ) { }

  findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email: email }, relations: ['company'] });
  }

  findOneById(id: number): Promise<User> {
    return this.userRepository.findOne(id, { relations: ['company'] });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.save({
      ...createUserDto,
      company: await this.companyService.create(createUserDto.company)
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

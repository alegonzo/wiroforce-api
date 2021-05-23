import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyService } from '../../company/services/company.service';
import { CreateMemberDto } from '../dto/create-member.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Profile } from '../entities/profile.entity';
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
    return this.userRepository.findOne(id, { relations: ['company', 'profile'] });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.save({
      ...createUserDto,
      profile: new Profile(createUserDto),
      company: await this.companyService.create(createUserDto.company)
    });
  }


  //Team members

  findMembers(companyId: number): Promise<User[]> {
    return this.userRepository.find({ where: { companyId: companyId } });
  }

  async createMember(createMemberDto: CreateMemberDto) {
    return this.userRepository.save({
      ...createMemberDto,
      company: await this.companyService.findOne(createMemberDto.companyId)
    });
  }

  async removeMember(id: number) {
    await this.userRepository.delete(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

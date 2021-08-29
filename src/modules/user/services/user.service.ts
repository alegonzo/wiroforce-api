import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';
import { Role } from '../../auth/enums/role.enum';
import { AuthService } from '../../auth/services/auth.service';
import { CompanyService } from '../../company/services/company.service';
import { MailService } from '../../mail/mail.service';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { CreateMemberDto } from '../dto/create-member.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { GetAllUsersQueryDto } from '../dto/get-all-users-query.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Profile } from '../entities/profile.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private companyService: CompanyService,
    private mailService: MailService,
  ) {}

  async findAll(queryDto: GetAllUsersQueryDto): Promise<PaginatedResponseDto> {
    const result = await this.userRepository.findAndCount({
      relations: ['profile', 'company'],
      where:
        queryDto?.search !== ''
          ? {
              email: Like(`%${queryDto.search}%`),
            }
          : undefined,
      skip: queryDto.size * queryDto.page,
      take: queryDto.size,
      order: {
        id: 'DESC',
      },
    });
    return new PaginatedResponseDto({
      result: result[0],
      count: result[1],
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email: email },
      relations: ['company'],
    });
  }

  async findOneByCompanyId(companyId: number): Promise<User> {
    return this.userRepository.findOne({
      where: { companyId: companyId },
    });
  }

  findOneById(id: number): Promise<User> {
    return this.userRepository.findOne(id, {
      relations: ['company', 'profile'],
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.mailService.sendEmailToAdmin(
      'Nuevo usuario registrado',
      `El usuario "${createUserDto.fullName}" con correo "${createUserDto.email}" ha creado el estudio "${createUserDto.company}".`,
    );
    return this.userRepository.save({
      ...createUserDto,
      profile: new Profile({}),
      company: await this.companyService.create(createUserDto.company),
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne(id, {
      relations: ['profile'],
    });
    user.profile.address = updateUserDto.address;
    user.profile.nitOnat = updateUserDto.nitOnat;
    user.profile.phone = updateUserDto.phone;
    user.profile.province = updateUserDto.province;
    user.profile.bankCard = updateUserDto.bankCard;
    return this.userRepository.save(user);
  }

  async updateStatus(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);
    user.active = !user.active;
    await this.mailService.sendEmailToUser(
      user,
      'Cambio en su cuenta de WiroForce',
      user.active
        ? 'Su cuenta ha sido activada. Ingrese en la plataforma y complete sus datos en la sección "Cuenta" para comenzar a utilizar nuestros servicios.'
        : 'Su cuenta ha sido desactivada. Contacte al equipo de soporte si se debe a un error de la plataforma.',
    );
    return this.userRepository.save(user);
  }

  saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  //Team members

  findMembers(companyId: number): Promise<User[]> {
    return this.userRepository.find({ where: { companyId: companyId } });
  }

  async createMember(createMemberDto: CreateMemberDto) {
    return this.userRepository.save({
      ...createMemberDto,
      company: await this.companyService.findOne(createMemberDto.companyId),
    });
  }

  async removeMember(id: number) {
    await this.userRepository.delete(id);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  //Admin
  async createAdmin(body: CreateAdminDto) {
    return this.userRepository.save({
      ...body,
      roles: Role.ADMIN,
      active: true,
      profile: null,
      company: null,
    });
  }
}

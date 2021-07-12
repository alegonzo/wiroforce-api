import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/services/user.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { CreateAdminDto } from '../../user/dto/create-admin.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string) {
        const user = await this.userService.findOneByEmail(email);
        if (!user?.active)
            return null;
        const match = await this.comparePassword(pass, user.password);
        if (!match)
            return null;

        // tslint:disable-next-line: no-string-literal
        const { password, profile, companyId, createdAt, active, updatedAt, ...result } = user;
        return result;
    }

    public async login(user) {
        const token = await this.generateToken(user);
        return { user, token };
    }

    public async create(user: CreateUserDto) {
        const pass = await this.hashPassword(user.password);
        const newUser = await this.userService.create({ ...user, password: pass });
        const { password, profile, companyId, createdAt, active, updatedAt, ...result } = newUser;
        const token = await this.generateToken(result);
        return { user: result, token };
    }

    public async createAdmin(user: CreateAdminDto) {
        const pass = await this.hashPassword(user.password);
        const newUser = await this.userService.createAdmin({ ...user, password: pass });
        const { password, profile, companyId, createdAt, active, updatedAt, ...result } = newUser;
        const token = await this.generateToken(result);
        return { user: result, token };
    }

    public async changePassword(email: string, body: ChangePasswordDto) {
        const user = await this.userService.findOneByEmail(email);
        const match = await this.comparePassword(body.oldPassword, user?.password);
        if (!match) {
            throw new BadRequestException({ message: ['La contraseña actual no es correcta'] });
        }
        else {
            user.password = await this.hashPassword(body.newPassword);
        }
        await this.userService.saveUser(user);
        return { message: 'Contraseña cambiada correctamente' };
    }

    private async generateToken(user) {
        const token = await this.jwtService.signAsync(user);
        return token;
    }

    private async hashPassword(password) {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    private async comparePassword(enteredPassword, dbPassword) {
        const match = await bcrypt.compare(enteredPassword, dbPassword);
        return match;
    }

}
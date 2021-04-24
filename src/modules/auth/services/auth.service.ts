import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/services/user.service';
import { LoginDto } from '../dto/login.dto';
import { CreateUserDto } from '../../user/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(loginDto: LoginDto) {
        // find if user exist with this email
        const user = await this.userService.findOneByEmail(loginDto.email);
        if (!user) {
            return null;
        }

        // find if user password match
        const match = await this.comparePassword(loginDto.password, user.password);
        if (!match) {
            return null;
        }

        // tslint:disable-next-line: no-string-literal
        const { password, ...result } = user;
        return result;
    }

    public async login(user) {
        const token = await this.generateToken(user);
        return { user, token };
    }

    public async create(user: CreateUserDto) {
        // hash the password
        const pass = await this.hashPassword(user.password);

        // create the user
        const newUser = await this.userService.create({ ...user, password: pass });

        const { password, ...result } = newUser;

        // generate token
        const token = await this.generateToken(result);

        // return the user and the token
        return { user: result, token };
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
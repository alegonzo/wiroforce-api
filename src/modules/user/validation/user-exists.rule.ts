import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { UserService } from "../services/user.service";

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UserExistsRule implements ValidatorConstraintInterface {
    constructor(private userService: UserService) { }

    async validate(email: string) {
        try {
            await this.userService.findOneByEmail(email);
        } catch (e) {
            return false;
        }
        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return `El usuario con este email ya existe`;
    }
}
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Validate } from "class-validator";
import { CompanyExistsRule } from "../validation/company-exists.rule";
import { UserExistsRule } from "../validation/user-exists.rule";

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Validate(UserExistsRule)
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Validate(CompanyExistsRule)
    company: string;
}

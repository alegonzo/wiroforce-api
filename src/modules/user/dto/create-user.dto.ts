import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Validate } from "class-validator";
import { Province } from "../enums/province.enum";
import { Role } from "../enums/role.enum";
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

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    province: Province;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    phone: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    address: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nitOnat: string;

    license: string;
    role: Role;
}

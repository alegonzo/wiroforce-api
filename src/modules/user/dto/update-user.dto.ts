import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { Province } from "../enums/province.enum";

export class UpdateUserDto {

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    province: Province;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    phone: string;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    address: string;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    nitOnat: string;

}

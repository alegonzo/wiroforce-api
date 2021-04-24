import { IsBoolean, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    itemId: string;

    @IsNotEmpty()
    price: number;

    @IsOptional()
    description: string;

    @IsString()
    @IsNotEmpty()
    resourceAmount: string;

    @IsNotEmpty()
    @IsBoolean()
    offline: boolean;

    @IsNotEmpty()
    @IsNumber()
    applicationId: number;
}

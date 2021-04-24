import { IsBoolean, IsNumberString, IsOptional, IsString } from "class-validator";

export class UpdateProductDto {
    @IsOptional()
    @IsNumberString()
    price: number;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    resourceAmount: string;

    @IsOptional()
    @IsBoolean()
    offline: boolean;

    @IsOptional()
    @IsBoolean()
    active: boolean;
}

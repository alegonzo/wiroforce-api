import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNumberString, IsOptional, IsString } from "class-validator";

export class UpdateProductDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    price: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    resourceAmount: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    offline: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    active: boolean;
}

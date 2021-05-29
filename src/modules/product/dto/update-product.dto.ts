import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsBooleanString, IsNumberString, IsOptional, IsString } from "class-validator";

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
    @IsBooleanString()
    offline: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    active: boolean;
}

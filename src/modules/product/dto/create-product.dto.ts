import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    itemId: string;

    @ApiProperty()
    @IsNotEmpty()
    price: number;

    @ApiPropertyOptional()
    @IsOptional()
    description: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    resourceAmount: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    offline: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    applicationId: number;
}

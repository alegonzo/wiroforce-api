import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBooleanString, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";

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
    @IsNumberString()
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
    @IsBooleanString()
    offline: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    appId: string;
}

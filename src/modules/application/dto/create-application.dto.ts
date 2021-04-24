import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateApplicationDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
}

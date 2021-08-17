import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  BANK_CARD_REGEXP,
  PHONE_REGEXP,
  SPECIAL_CHARS_REGEXP,
  PROVINCES,
} from '../../../common/utils/constants';
import { Province } from '../enums/province.enum';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsIn(PROVINCES)
  province: Province;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Matches(PHONE_REGEXP)
  @Length(8)
  phone: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  address: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Matches(SPECIAL_CHARS_REGEXP)
  nitOnat: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Matches(BANK_CARD_REGEXP)
  @Length(16)
  bankCard: string;
}

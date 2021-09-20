import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import {
  SPECIAL_CHARS_REGEXP,
  SPECIAL_CHARS_REGEXP_NO_SPACE,
} from '../../../common/utils/constants';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(SPECIAL_CHARS_REGEXP)
  @MaxLength(25)
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(SPECIAL_CHARS_REGEXP_NO_SPACE)
  @MaxLength(10)
  itemId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  price: number;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(80)
  //@Matches(SPECIAL_CHARS_REGEXP)
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
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

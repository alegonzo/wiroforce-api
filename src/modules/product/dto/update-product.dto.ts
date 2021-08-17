import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsBooleanString,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { SPECIAL_CHARS_REGEXP } from '../../../common/utils/constants';

export class UpdateProductDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  price: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(SPECIAL_CHARS_REGEXP)
  @MaxLength(80)
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(45)
  resourceAmount: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBooleanString()
  offline: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  active: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { SPECIAL_CHARS_REGEXP } from '../../../common/utils/constants';
import { CompanyExistsRule } from '../validation/company-exists.rule';
import { UserExistsRule } from '../validation/user-exists.rule';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(30)
  @Validate(UserExistsRule)
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(SPECIAL_CHARS_REGEXP)
  @MaxLength(100)
  fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(SPECIAL_CHARS_REGEXP)
  @MaxLength(30)
  @Validate(CompanyExistsRule)
  company: string;
}

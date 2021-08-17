import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { SPECIAL_CHARS_REGEXP } from '../../../common/utils/constants';

export class CreateApplicationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(SPECIAL_CHARS_REGEXP)
  @MaxLength(30)
  name: string;
}

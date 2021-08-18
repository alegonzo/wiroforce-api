import { IsString, Max, Min } from 'class-validator';

export class QueryAllApplicationDto {
  companyId: string;
  search: string;
  page: number;
  size: number;
}

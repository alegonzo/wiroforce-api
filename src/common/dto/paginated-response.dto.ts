export class PaginatedResponseDto {
  result: any[];
  count: number;

  constructor(partial: Partial<PaginatedResponseDto>) {
    Object.assign(this, partial);
  }
}

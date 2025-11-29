/**
 * Common DTO interfaces
 */

export interface PaginationDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DateRangeDto {
  startDate?: Date;
  endDate?: Date;
}

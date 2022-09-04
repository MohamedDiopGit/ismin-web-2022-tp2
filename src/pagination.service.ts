import { Injectable } from '@nestjs/common';

export interface PaginatedType<T> {
  data: T[];
  page: number;
  total: number;
}

@Injectable()
export class PaginationService {
  private readonly defaultPage = 0;
  private readonly defaultSize = 2;

  paginatedData<T>(
    data: T[],
    page: number | string | undefined,
    size: number | string | undefined,
  ): PaginatedType<T> {
    const pageAsNumber = PaginationService.getAsNumberOrDefault(
      page,
      this.defaultPage,
    );
    const sizeAsNumber = PaginationService.getAsNumberOrDefault(
      size,
      this.defaultSize,
    );

    const slicedData = data.slice(
      sizeAsNumber * pageAsNumber,
      sizeAsNumber * (pageAsNumber + 1),
    );

    return {
      data: slicedData,
      page: pageAsNumber,
      total: data.length,
    };
  }

  private static getAsNumberOrDefault(
    value: number | string | undefined,
    defaultValue: number,
  ): number {
    return value ? parseInt(value.toString()) : defaultValue;
  }
}

import type { PaginateData } from "@/types/pagination-data";

export class PaginateDataModel<T> implements PaginateData<T> {
  page: number = 1;
  page_size: number = 10;
  total_itens: number = 0;
  total_pages: number = 1;
  itens: T[] = [];

  constructor(init?: Partial<PaginateData<T>>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

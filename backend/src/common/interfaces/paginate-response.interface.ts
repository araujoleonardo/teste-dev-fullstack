export interface PaginateResponse<T> {
  page: number;
  page_size: number;
  total_itens: number;
  total_pages: number;
  itens: T[];
}

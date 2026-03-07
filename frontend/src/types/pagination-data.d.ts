export interface PaginateData<T> {
  page: number;
  page_size: number;
  total_itens: number;
  total_pages: number;
  itens: T[];
}

export interface IParams {
  page?: number;
  page_size?: number;
  search?: string;
  field?: string;
  direction?: 'ASC' | 'DESC';
}

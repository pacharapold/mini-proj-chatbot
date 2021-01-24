export interface Pagination {
  page: number;
  pageSize?: number;
  itemsPerPage?: number;
}

export default class Page {
  static result<M>(
    { rows, count }: { rows: M[]; count: number },
    pagination: Pagination,
  ) {
    const pageSize = this.getPageSize(pagination);
    const total = pageSize === -1 ? count : pageSize;
    return {
      result: rows,
      length: count,
      totalPage: Math.ceil(count / total),
    };
  }

  private static getPageSize({ pageSize, itemsPerPage }: Pagination): number {
    return pageSize ?? itemsPerPage ?? 10;
  }

  static of(
    pagination: Pagination,
  ): {
    offset: number;
    limit: number | undefined;
  } {
    const pageSize = this.getPageSize(pagination);
    const limit = pageSize === -1 ? undefined : pageSize;
    return {
      limit,
      offset: this.getPageSize(pagination) * (pagination.page - 1),
    };
  }
}

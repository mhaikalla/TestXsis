export interface PagingFilter {
    page: number
    limit: number
}

export type SortDirection = "asc" | "desc"

export interface SortingFilter<T> {
    sort_col?: keyof T
    sort_dir?: SortDirection
}

export type QueryFilterParam<T> = { [x in keyof QueryFilter<T>]?: string } & { [x in keyof T]?: string }
export class QueryFilter<T> implements SortingFilter<T>, PagingFilter {
    page: number;
    limit: number;
    sort_col?: keyof T;
    sort_dir?: SortDirection;
    keyword?: string

    constructor(filter: QueryFilterParam<T>) {
        this.page = filter.page ? parseInt(filter.page) : 1
        this.limit = filter.limit ? parseInt(filter.limit) : 10
        this.sort_col = filter.sort_col ? filter.sort_col as keyof T : undefined
        this.sort_dir = filter.sort_dir ? filter.sort_dir as SortDirection : undefined
        this.keyword = filter.keyword
    }
}

export interface PaginatedData<TFilter, TData> {
    data: TData[],
    filter_info: TFilter,
    count_info: {
        filtered_records: number,
        total_records: number
        page_count: number
    }
}

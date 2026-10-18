/** Single resource envelope returned by Laravel API Resources. */
export interface ApiResource<T> {
  data: T;
}

/** Cursor-paginated collection (no total count, by design). */
export interface CursorPaginated<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    path: string;
    per_page: number;
    next_cursor: string | null;
    prev_cursor: string | null;
  };
}

export interface MessageResponse {
  message: string;
}

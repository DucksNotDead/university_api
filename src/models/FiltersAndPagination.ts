import { z } from 'zod';

export const Filters = z.object({
  filters: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
});

export const Pagination = z.object({
  pagination: z
    .object({
      pageSize: z.number().nonnegative().optional(),
      pageIndex: z.number().nonnegative().optional(),
    })
    .optional(),
});

export const FiltersAndPagination = Filters.merge(Pagination).optional();

export type TPagination = z.infer<typeof Pagination>;

export type TFilters = z.infer<typeof Filters>;

export type TFiltersAndPagination = z.infer<typeof FiltersAndPagination>;

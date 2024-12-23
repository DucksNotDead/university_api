import { z } from 'zod';

const Filter = z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]));

export const Filters = z.object({
  filters: Filter.optional(),
});

export const Pagination = z.object({
  pagination: z
    .object({
      pageSize: z.number().nonnegative().optional(),
      pageIndex: z.number().nonnegative().optional(),
    })
    .optional(),
});

export const FiltersAndPagination = Filters.merge(Pagination).partial();

export type TPagination = z.infer<typeof Pagination>;

export type TFilter = z.infer<typeof Filter>;

export type TFilters = z.infer<typeof Filters>;

export type TFiltersAndPagination = z.infer<typeof FiltersAndPagination>;

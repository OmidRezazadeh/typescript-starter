// user.filter.schema.ts
import { z } from 'zod';

const userIdPre = z.preprocess((v) => {
  if (typeof v === "string" && v.trim()) {
    const n = Number(v);
    return Number.isNaN(n) ? v : n;
  }
  return v;
}, z.number().int().positive().optional());

const createdAtPre = z.preprocess((v) => {
  if (typeof v === "string" && v.trim()) {
    const d = new Date(v);
    return isNaN(d.getTime()) ? v : d;
  }
  return v;
}, z.date().optional());

export const FilterSchema = z.object({
  userId: userIdPre,
  email: z.string().email().optional(),
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  createdAt: createdAtPre,

   // ✅ Pagination
  page: z.preprocess(
    (v) => {
      const n = Number(v);
      return Number.isNaN(n) ? v : n;
    },
    z.number().int().min(1)
  )
    .default(1)
    .optional(),

  limit: z.preprocess(
    (v) => {
      const n = Number(v);
      return Number.isNaN(n) ? v : n;
    },
    z.number().int().min(1).max(100)
  )
    .default(1)
    .optional(),
});

export type FiltersDto = z.infer<typeof FilterSchema>;

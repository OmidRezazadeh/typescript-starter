// src/auth/auth.schema.ts
import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string({ message: "ایمیل الزامی است" })
    .email({ message: "ایمیل معتبر نیست" }),

  password: z
    .string({ message: "رمز عبور الزامی است" })
    .min(6, { message: "رمز عبور باید حداقل ۶ کاراکتر باشد" }),

  name: z.string().optional(),
});

export const loginSchema = z.object({
  email: z
    .string({ message: "ایمیل الزامی است" })
    .email({ message: "ایمیل معتبر نیست" }),

  password: z
    .string({ message: "رمز عبور الزامی است" })
    .min(1, { message: "رمز عبور الزامی است" }),
});
// TypeScript types inferred from Zod schemas
export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;

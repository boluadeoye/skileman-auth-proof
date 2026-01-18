import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .email()
    .min(5)
    .max(255)
    .trim()
    .toLowerCase(),
    
  password: z
    .string()
    .min(8)
    .max(100),
}).strict();

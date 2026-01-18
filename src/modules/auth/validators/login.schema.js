import { z } from "zod";

/**
 * @description Strict validation schema for authentication
 * @security Enforces email format and password complexity policies
 */
export const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email format provided." })
    .min(5)
    .max(255)
    .trim()
    .toLowerCase(),
    
  password: z
    .string()
    .min(8, { message: "Password does not meet complexity requirements (min 8 chars)." })
    .max(100),
}).strict(); // Security: Reject unknown payloads to prevent pollution

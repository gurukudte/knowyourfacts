import * as z from "zod";
export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z
    .string()
    .min(6, { message: "Minimum 6 characters required" })
    .max(30),
});
export const SignupSchema = z.object({
  userName: z.string({ message: "User name is required" }),
  email: z.string().email({ message: "Email is required" }),
  password: z
    .string()
    .min(6, { message: "Minimum 6 characters required" })
    .max(30),
});

import z from "zod/v4";

/* ------------------------------
 * Shared field schemas
 * ------------------------------ */

const emailSchema = z.email().nonempty("Email is required");

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters");

/* ------------------------------
 * Auth schemas
 * ------------------------------ */

export const createUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: emailSchema,
  password: passwordSchema,
});

export const loginUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

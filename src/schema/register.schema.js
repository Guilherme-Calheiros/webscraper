import { z } from "zod";
import { emailSchema } from "./email.schema.js";
import { passwordSchema } from "./password.schema.js";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, "O nome deve ter no mínimo 3 caracteres")
      .max(100, "O nome deve ter no máximo 100 caracteres"),

    email: emailSchema.shape.email,

    password: passwordSchema.shape.password,
    confirmPassword: passwordSchema.shape.password,
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "As senhas não coincidem",
      });
    }
  });

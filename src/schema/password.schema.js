import { z } from 'zod';

export const passwordSchema = z.object({
    password: z.string().min(8, { message: "A senha deve ter no mínimo 8 caracteres" }),
});
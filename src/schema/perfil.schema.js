import { z } from 'zod';
import { emailSchema } from './email.schema.js';
import { passwordSchema } from './password.schema.js';

export const perfilSchema = z.object({
    name: z.string().min(3, { message: "O nome deve ter no mínimo 3 caracteres" }).max(100, { message: "O nome deve ter no máximo 100 caracteres" }),
    email: emailSchema.shape.email,
    oldPassword: z.string().optional(),
    newPassword: passwordSchema.shape.password.optional(),
})
.superRefine((data, ctx) => {
    if(data.newPassword){
        if (!data.oldPassword) {
            ctx.addIssue({
                code: "old_password_required",
                message: "Para alterar a senha, a senha atual é obrigatória",
            });
        }

        if (data.newPassword === data.oldPassword) {
            ctx.addIssue({
                code: "new_password_different",
                message: "A nova senha deve ser diferente da senha atual",
            });
        }
    }
});
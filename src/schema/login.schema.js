import { z } from 'zod';
import { emailSchema } from './email.schema.js';
import { passwordSchema } from './password.schema.js';

export const loginSchema = z.object({
    email: emailSchema.shape.email,
    password: passwordSchema.shape.password,
});
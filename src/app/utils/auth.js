import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../db";
import * as schema from "../../db/schema";
import { Resend } from "resend";

const resend = new Resend(process.env.API_RESEND_KEY);

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema
    }),

    user: {
        changeEmail: { 
            enabled: true,
            updateEmailWithoutVerification: true
        },
        deleteUser: { 
            enabled: true
        }
    },

    emailVerification: {
        sendVerificationEmail: async ({ user, url}) => {
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: user.email,
                subject: 'Verifique seu endereço de e-mail',
                text: `Clique no link para verificar seu e-mail: ${url}`
            })
        },

        sendOnSignIn: true,
    },

    emailAndPassword: { 
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: user.email,
                subject: 'Redefina sua senha',
                text: `Clique no link para redefinir sua senha: ${url}`
            })
        },
    },

    trustedOrigins: process.env.TRUSTED_ORIGINS,
    
});
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../db";
import * as schema from "../../db/schema";
import { Resend } from "resend";
import VerificarEmail from "../components/VerificarEmail";
import RedefinirSenha from "../components/RedefinirSenha";

const resend = new Resend(`${process.env.RESEND_API_KEY}`);

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
                from: `MeliTrack <${process.env.EMAIL_FROM}>`,
                to: user.email,
                subject: 'Verifique seu endereço de e-mail',
                react: <VerificarEmail user={user} url={url} />
            })
        },

        sendOnSignIn: true,
    },

    emailAndPassword: { 
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            console.log("Sending password reset email to:", user.email, "with URL:", url);
            await resend.emails.send({
                from: `MeliTrack <${process.env.EMAIL_FROM}>`,
                to: user.email,
                subject: 'Redefina sua senha',
                react: <RedefinirSenha user={user} url={url} />
            })
        },
    },
    
});
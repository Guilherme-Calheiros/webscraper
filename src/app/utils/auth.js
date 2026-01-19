import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../db";
import * as schema from "../../db/schema";

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

    emailAndPassword: { 
        enabled: true, 
    },

    trustedOrigins: (origin) => {
        if (origin === "http://localhost:3000") return true;

        if (process.env.NODE_ENV === "production") {
            const trusted = process.env.BETTER_TRUSTED_ORIGINS?.split(",") ?? [];
            return trusted.includes(origin);
        }

        return false;
    }
    
});
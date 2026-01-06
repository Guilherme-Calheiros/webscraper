import { NextResponse } from "next/server";
import { db } from "@/db/index.js";
import { users } from "@/db/schema/domain-schema.js";
import { asc, eq } from "drizzle-orm";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");
        if (email) {
            const user = await db
                .select({
                    id: users.id,
                    name: users.name,
                    email: users.email,
                    createdAt: users.createdAt,
                })
                .from(users)
                .where(eq(users.email, email))
                .limit(1)
                .get();
            return NextResponse.json({ user });
        }

        const allUsers = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                createdAt: users.createdAt,
            })
            .from(users)
            .orderBy(asc(users.createdAt));

        return NextResponse.json({ users: allUsers }, { status: 200 });

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Erro ao buscar o usuário" },
            { status: 500 }
        );
    }
}
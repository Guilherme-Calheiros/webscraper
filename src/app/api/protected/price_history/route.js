import { NextResponse } from "next/server";
import { db } from "@/db/index.js";
import { historyPrice } from "@/db/schema/domain-schema.js";
import { desc, eq } from "drizzle-orm";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const productAlertId = searchParams.get("productAlertId");

        if (!productAlertId) {
            return NextResponse.json(
                { error: "productAlertId é obrigatório" },
                { status: 400 }
            );
        }

        const history = await db
            .select()
            .from(historyPrice)
            .where(eq(historyPrice.productAlertId, Number(productAlertId)))
            .orderBy(desc(historyPrice.recordedAt));

        return NextResponse.json({ history });
        
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Erro ao buscar os alertas de produto" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { productAlertId, price } = body;

        if (productAlertId == null || price == null) {
            return NextResponse.json(
                { error: "Faltando campos obrigatórios" },
                { status: 400 }
            );
        }

        if (typeof productAlertId !== "number" || typeof price !== "number") {
            return NextResponse.json(
                { error: "Tipos inválidos" },
                { status: 400 }
            );
        }

        const lastHistory = await db
            .select({ price: historyPrice.price })
            .from(historyPrice)
            .where(eq(historyPrice.productAlertId, productAlertId))
            .orderBy(desc(historyPrice.recordedAt))
            .limit(1);

        if (lastHistory.length > 0 && lastHistory[0].price === price) {
            return NextResponse.json(
                { success: true, skipped: true },
                { status: 200 }
            );
        }

        await db.insert(historyPrice).values({
            productAlertId,
            price,
        });

        return NextResponse.json(
            { success: true },
            { status: 201 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Erro ao processar a solicitação" },
            { status: 500 }
        );
    }
}

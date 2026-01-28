import { NextResponse } from "next/server";
import { db } from "@/db/index.js";
import { productAlert } from "@/db/schema/domain-schema.js";
import { historyPrice } from "@/db/schema/domain-schema.js";
import { eq } from "drizzle-orm";
import { Resend } from "resend";

const resend = new Resend(process.env.API_RESEND_KEY);

async function buscarProduto(alert) {

    const url = alert.productUrl;
    const mlb = alert.productId;

    const response = await fetch(`${process.env.BETTER_PUBLIC_URL}/api/scrape`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, mlb })
    })

    const data = await response.json();

    if (data.posts && data.posts.length > 0) {
        const produto = data.posts[0];
        
        const currentPrice = Number(produto.current_price);
        const alertPrice = Number(alert.currentPrice);
        const targetPrice = Number(alert.targetPrice);

        if (currentPrice <= targetPrice && !alert.triggeredAt) {
            try {
                await resend.emails.send({
                    from: 'onboarding@resend.dev',
                    to: alert.email,
                    subject: `Alerta de preço para ${alert.productName}`,
                    text: `O preço do produto ${alert.productName} caiu para ${currentPrice}.`
                });
            } catch (error) {
                console.error("Erro ao enviar o e-mail:", error);
            }
        }
        
        if (currentPrice === alertPrice) {
            return false;
        }

        await db
            .insert(historyPrice)
            .values({
                productAlertId: alert.id,
                price: currentPrice.toFixed(2),
            });

        await db
            .update(productAlert)
            .set({
                currentPrice: currentPrice.toFixed(2),
                triggeredAt:
                    currentPrice <= targetPrice && !alert.triggeredAt
                        ? new Date()
                        : alert.triggeredAt
            })
            .where(eq(productAlert.id, alert.id));
    }
}

export async function GET(){
    try {

        const list = await db.select().from(productAlert);

        for (const alert of list) {
            await buscarProduto(alert);
        }

        return NextResponse.json(
            { success: true },
            { status: 200 }
        );


    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Erro ao processar a solicitação" },
            { status: 500 }
        );
    }
}
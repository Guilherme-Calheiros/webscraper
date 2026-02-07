import { NextResponse } from "next/server";
import { db } from "@/db/index.js";
import { productAlert } from "@/db/schema/domain-schema.js";
import { historyPrice } from "@/db/schema/domain-schema.js";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import EmailAlerta from "@/app/components/EmailAlerta";

const resend = new Resend(process.env.RESEND_API_KEY);

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
                    from: `MeliTrack <${process.env.EMAIL_FROM}>`,
                    to: alert.userEmail,
                    subject: `Alerta de preço para ${alert.productName}`,
                    react: <EmailAlerta  
                        currentPrice={currentPrice}
                        targetPrice={targetPrice}
                        productName={alert.productName}
                        productUrl={alert.productUrl}
                    />
                });

                await db
                    .update(productAlert)
                    .set({
                        triggeredAt: new Date(),
                        emailSentAt: new Date(),
                        isActive: 0
                    })
                    .where(eq(productAlert.id, alert.id));

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

export async function GET(request){
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json(
            { error: "Sem autorização" },
            { status: 401 }
        );
    }

    try {

        const list = await db
            .select()
            .from(productAlert)
            .where(eq(productAlert.isActive, 1));

        const BATCH_SIZE = 10;
        for (let i = 0; i < list.length; i += BATCH_SIZE) {
            const batch = list.slice(i, i + BATCH_SIZE);
            await Promise.allSettled(
                batch.map(alert => buscarProduto(alert))
            );
        }

        return NextResponse.json(
            { success: list },
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
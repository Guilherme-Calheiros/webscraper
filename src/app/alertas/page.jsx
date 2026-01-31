import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/app/utils/auth";
import { db } from "@/db";
import { productAlert } from "@/db/schema/domain-schema";
import { eq, desc } from "drizzle-orm";
import AlertCard from "../components/AlertCard";
import { Header } from "../components/Header";
import { Bell, Package } from "lucide-react";

export default async function AlertasPage() {
    const session = await auth.api.getSession({
        headers: Object.fromEntries((await headers()).entries())
    });

    if (!session?.user) {
        redirect("/login");
    }

    const alertas = await db
        .select()
        .from(productAlert)
        .where(eq(productAlert.userId, session.user.id))
        .orderBy(desc(productAlert.createdAt));

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="mx-auto px-4 py-6 md:py-8">
                <div className="mb-6 md:mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Bell className="w-5 h-5 text-primary" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Meus Alertas</h1>
                    </div>
                    <p className="text-gray-600 text-sm md:text-base">
                        Acompanhe os preços dos seus produtos favoritos
                    </p>
                </div>

                {alertas.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                                <Package className="w-5 h-5 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Total de Alertas</p>
                                    <p className="text-2xl font-bold text-gray-900">{alertas.length}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Bell className="w-5 h-5 text-green-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Alertas Ativos</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {alertas.filter(a => a.isActive).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {alertas.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                            Nenhum alerta configurado
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm md:text-base">
                            Comece a monitorar preços de produtos do Mercado Livre. 
                            Busque um produto e crie seu primeiro alerta!
                        </p>
                        <a 
                            href="/" 
                            className="inline-flex items-center gap-2 bg-primary text-secondary px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                        >
                            <Package className="w-5 h-5" />
                            Buscar Produtos
                        </a>
                    </div>
                ) : ( 
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {alertas.map((alerta) => (
                            <AlertCard key={alerta.id} alerta={alerta} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
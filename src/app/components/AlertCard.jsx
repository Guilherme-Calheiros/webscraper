'use client'

import { DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "./ui/dialog";
import { NumericFormat } from "react-number-format";
import { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, TrendingDown, TrendingUp, ExternalLink, Calendar } from "lucide-react";
import { formatarMoeda } from "../utils/preco";
import { toast } from "sonner";

export default function AlertCard({ alerta }) {
    const [targetPrice, setTargetPrice] = useState(alerta.targetPrice);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const priceDifference = alerta.currentPrice - alerta.targetPrice;
    const percentageDifference = ((priceDifference / alerta.targetPrice) * 100).toFixed(1);
    const isAboveTarget = priceDifference > 0;

    const createdDate = new Date(alerta.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    async function editarAlerta() {
        if (isEditing) return;
        setIsEditing(true);

        const payload = {
            id: alerta.id,
            targetPrice: targetPrice
        }

        try {
            const response = await fetch('/api/protected/alerts', {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success('Alerta atualizado com sucesso!');
                setOpenEditDialog(false);
                router.refresh();
            } else {
                toast.error('Erro ao atualizar o alerta.');
            }
        } finally {
            setIsEditing(false);
        }
    }

    async function excluirAlerta() {
        if (isDeleting) return;
        setIsDeleting(true);

        const payload = {
            id: alerta.id
        }

        try {
            const response = await fetch('/api/protected/alerts', {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success('Alerta excluído com sucesso!');
                setOpenDeleteDialog(false);
                router.refresh();
            } else {
                toast.error('Erro ao excluir o alerta.');
            }
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
            <div className="p-4 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <a 
                            href={alerta.productUrl} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm md:text-base font-semibold text-secondary hover:text-blue-600 hover:underline line-clamp-2 transition-colors group"
                        >
                            {alerta.productName}
                            <ExternalLink className="inline-block w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>Criado em {createdDate}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 flex-1">
                <div className="grid grid-cols-1 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1 font-medium">Preço Atual</p>
                        <p className="text-xl md:text-2xl font-bold text-gray-900">
                            {formatarMoeda(alerta.currentPrice)}
                        </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1 font-medium">Preço Alvo</p>
                        <p className="text-xl md:text-2xl font-bold text-blue-600">
                            {formatarMoeda(alerta.targetPrice)}         
                        </p>
                    </div>
                </div>

                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    isAboveTarget 
                        ? 'bg-amber-50 border border-amber-200' 
                        : 'bg-green-50 border border-green-200'
                }`}>
                    {isAboveTarget ? (
                        <TrendingUp className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    ) : (
                        <TrendingDown className="w-5 h-5 text-green-600 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${
                            isAboveTarget ? 'text-amber-700' : 'text-green-700'
                        }`}>
                            {isAboveTarget ? 'Acima' : 'Abaixo'} do alvo
                        </p>
                        <p className={`text-xs ${
                            isAboveTarget ? 'text-amber-600' : 'text-green-600'
                        }`}>
                            {formatarMoeda(Math.abs(priceDifference))} ({Math.abs(percentageDifference)}%)
                        </p>
                    </div>
                </div>
            </div>
            <div className="p-3 bg-gray-50 border-t border-gray-100 rounded-b-lg flex gap-2">
                <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                    <DialogTrigger asChild>
                        <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 flex items-center justify-center gap-2 text-xs md:text-sm"
                        >
                            <Edit2 className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="hidden sm:inline">Editar</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Editar Alerta</DialogTitle>
                            <DialogDescription className="text-foreground pt-2">
                                Atualize o preço alvo para <strong className="text-secondary">{alerta.productName}</strong>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <label htmlFor="priceGoal" className="text-sm font-medium text-gray-700 mb-2 block">
                                Preço Alvo
                            </label>
                            <NumericFormat
                                value={targetPrice}
                                onValueChange={(values) => setTargetPrice(values.floatValue)}
                                className='w-full border border-gray-300 rounded-md px-3 py-2.5 mb-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors'
                                placeholder='Preço alvo em R$'
                                allowLeadingZeros={false}
                                allowNegative={false}
                                decimalScale={2}
                                fixedDecimalScale={true}
                                decimalSeparator=','
                                allowedDecimalSeparators={['.']}
                                prefix='R$ '
                                thousandSeparator='.'
                            />
                            <p className="text-xs text-gray-500">
                                Preço atual: {formatarMoeda(alerta.currentPrice)}
                            </p>
                        </div>
                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                            </DialogClose>
                            <Button onClick={editarAlerta} disabled={isEditing}>
                                {isEditing ? 'Salvando...' : 'Salvar alteração'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                    <DialogTrigger asChild>
                        <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs md:text-sm"
                        >
                            <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="hidden sm:inline">Excluir</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Excluir Alerta</DialogTitle>
                        </DialogHeader>
                        <DialogDescription className="text-foreground">
                            Tem certeza que deseja excluir o alerta para <strong className="text-secondary">{alerta.productName}</strong>? 
                            <br /><br />
                            Esta ação não pode ser desfeita e você perderá todo o histórico de preços deste produto.
                        </DialogDescription>
                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                            </DialogClose>
                            <Button 
                                onClick={excluirAlerta}
                                disabled={isDeleting}
                                className="bg-red-200 hover:bg-red-300 text-red-800 hover:text-red-900"
                            >
                                {isDeleting ? 'Excluindo...' : 'Sim, Excluir'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
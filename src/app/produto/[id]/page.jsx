'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Header } from '@/app/components/Header';
import { DotsLoading } from '@/app/components/LoadingIndicator';
import { NumericFormat } from 'react-number-format';
import { formatarMoeda } from '@/app/utils/preco';
import { useAuth } from '@/app/providers/AuthProvider';
import { toast } from 'sonner';
import { BellPlus, ExternalLink, Star } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';

export default function Produto() {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const url = searchParams.get('url');
    const produtoInicial = {
        id: null,
        url: '',
        title: '',
        rating: null,
        rating_text: '',
        current_price: null,
        previous_price: null,
        discount: null,
        images: []
    };

    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [produto, setProduto] = useState(produtoInicial);
    const [index, setIndex] = useState(0);
    const [targetPrice, setTargetPrice] = useState(null);
    const [openCriarAlerta, setOpenCriarAlerta] = useState(false);

    async function carregarProduto() {
        setLoading(true);
        setIndex(0);
        const response = await fetch('/api/scrape', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url, mlb: id })
        });

        const data = await response.json();

        if (data.error) {
            toast.error(`Erro ao buscar o produto: ${data.error}`);
            setLoading(false);
            return;
        }

        if (data.blocked) {
            toast.error('Mercado Livre bloqueou a busca por este produto.');
            setLoading(false);
            return;
        }

        setProduto(data.posts[0]);
        setTargetPrice(data.posts[0].current_price);
        setLoading(false);
    }

    useEffect(() => {
        if (!id) return;
        setProduto(produtoInicial);
        setTargetPrice(null);
        carregarProduto();
    }, [id, url]);

    async function criarAlerta(produto) {
        const payload = {
            productId: produto.id,
            productName: produto.title,
            productUrl: produto.url,
            currentPrice: produto.current_price,
            targetPrice: targetPrice,
        }

        const response = await fetch('/api/protected/alerts', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            toast('Alerta criado com sucesso!');
            setOpenCriarAlerta(false);
        } else {
            const data = await response.json();
            toast.error(`Erro ao criar alerta: ${data.error}`);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            {loading ? (
                <div className='flex justify-center items-center min-h-[60vh]'>
                    <DotsLoading />
                </div>
            ) : (
                <div className='container mx-auto px-4 py-6 md:py-8 max-w-7xl'>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 p-4 md:p-6 lg:p-8">
                            <div className="relative bg-gray-50 rounded-lg p-4 md:p-6 flex items-center justify-center min-h-[300px] md:min-h-[400px] lg:min-h-[500px]">
                                {produto.discount && (
                                    <span className="absolute top-3 right-3 z-10 bg-green-600 text-white text-xs md:text-sm font-semibold px-3 py-1.5 rounded-lg shadow-md">
                                        {produto.discount}
                                    </span>
                                )}

                                {produto.images.map((img, i) => (
                                    <img
                                        key={img.id}
                                        src={img.url}
                                        alt={`${produto.title} - Imagem ${i + 1}`}
                                        className={`${i === index ? 'block' : 'hidden'} max-w-full h-[280px] md:h-[380px] lg:h-[480px] object-contain`}
                                    />
                                ))}
                                {produto.images.length > 1 && (
                                    <>
                                        <button
                                            className="prev absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white border-none cursor-pointer p-2 rounded-full transition-all group-hover:opacity-100"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIndex((index - 1 + produto.images.length) % produto.images.length);
                                            }}
                                            aria-label="Imagem anterior"
                                        >
                                            ‹
                                        </button>
                                        <button
                                            className="next absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white border-none cursor-pointer p-2 rounded-full transition-all group-hover:opacity-100"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIndex((index + 1) % produto.images.length);
                                            }}
                                            aria-label="Próxima imagem"
                                        >
                                            ›
                                        </button>

                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                            {produto.images.map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setIndex(i)}
                                                    className={`h-2 rounded-full transition-all ${
                                                        i === index
                                                            ? 'bg-primary w-6'
                                                            : 'bg-gray-300 hover:bg-gray-400 w-2'
                                                    }`}
                                                    aria-label={`Ir para imagem ${i + 1}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex flex-col gap-4 md:gap-6">
                                <div className="space-y-3">
                                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                                        {produto.title}
                                    </h1>

                                    {produto.rating ? (
                                        <div className="flex items-center gap-2 text-sm md:text-base">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-semibold text-gray-900">{produto.rating}</span>
                                            <span className="text-gray-500">• {produto.rating_text}</span>
                                        </div>
                                    ) : (
                                        <div className="text-sm md:text-base text-gray-500">Sem avaliações</div>
                                    )}
                                </div>

                                <div className="space-y-2 py-4 border-t border-gray-200">
                                    {produto.previous_price && (
                                        <p className="text-base md:text-lg text-gray-500 line-through">
                                            {formatarMoeda(produto.previous_price)}
                                        </p>
                                    )}
                                    <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                                        {formatarMoeda(produto.current_price)}
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                                    <a
                                        href={produto.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-primary text-secondary px-6 py-3.5 rounded-lg hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all font-semibold text-sm md:text-base flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                                        <span>Ver no Mercado Livre</span>
                                    </a>

                                    <Dialog open={openCriarAlerta} onOpenChange={setOpenCriarAlerta}>
                                        <DialogTrigger asChild>
                                            <button
                                                onClick={(e) => {
                                                    if (!user) {
                                                        e.preventDefault();
                                                        toast.error('Você precisa estar logado para criar um alerta.');
                                                        return;
                                                    }
                                                    setOpenCriarAlerta(true);
                                                }}
                                                className="flex-1 bg-secondary text-white px-6 py-3.5 rounded-lg hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all font-semibold text-sm md:text-base flex items-center justify-center gap-2 shadow-sm"
                                            >
                                                <BellPlus className="w-4 h-4 md:w-5 md:h-5" />
                                                <span>Criar Alerta</span>
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Criar Alerta de Preço</DialogTitle>
                                                <DialogDescription className="text-foreground pt-2">
                                                    Crie um alerta de preço para <strong className="text-secondary">{produto.title}</strong>
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="space-y-4 py-4">
                                                <NumericFormat
                                                    value={targetPrice}
                                                    onValueChange={(values) => setTargetPrice(values.floatValue)}
                                                    className='w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors'
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
                                                <p className="text-sm text-gray-500">
                                                    Preço atual: <span className="font-semibold">{formatarMoeda(produto.current_price)}</span>
                                                </p>
                                            </div>

                                            <DialogFooter className="gap-2">
                                                <DialogClose asChild>
                                                    <Button variant="outline">Cancelar</Button>
                                                </DialogClose>
                                                <Button onClick={() => criarAlerta(produto)}>
                                                    Criar Alerta
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
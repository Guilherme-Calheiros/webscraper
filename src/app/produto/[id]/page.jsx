'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/app/components/Header';
import { DotsLoading } from '@/app/components/LoadingIndicator';
import { NumericFormat } from 'react-number-format';
import { formatarMoeda } from '@/app/utils/preco';
import { useAuth } from '@/app/providers/AuthProvider';
import { toast } from 'sonner';

export default function Produto() {
    const { id } = useParams();
    const router = useRouter();
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

    async function carregarProduto() {
        setLoading(true);
        setIndex(0);
        const response = await fetch('/api/scrape', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url, mlb: id })
        });
        
        const data = await response.json();

        if(data.error){
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

    function modalCriarAlerta() {
        const modal = document.getElementById('modal-criar-alerta');
        modal.classList.toggle('hidden');
    }

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
            modalCriarAlerta();
        } else {
            const data = await response.json();
            toast.error(`Erro ao criar alerta: ${data.error}`);
        }
    }

    return (
        <div>
            <Header />
            {loading ? (
                <div className='flex justify-center items-centerm mt-4'>
                    <DotsLoading />
                </div>
            ) : (
                <>
                    <div className='flex flex-col items-center mt-4'>
                        <div className="produto-container bg-white md:w-5xl justify-center flex p-6 relative">
                            <div className="img-container w-full p-2 mb-3 flex items-center justify-center relative overflow-hidden">
                                {produto.images.map((img, i) => (
                                    <img
                                        key={img.id}
                                        src={img.url}
                                        className={i === index ? 'block max-w-full max-h-full object-contain' : 'hidden'}
                                    />
                                ))}
                                {produto.images.length > 1 && (
                                    <>
                                        <button
                                            className="prev absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/70 hover:bg-black text-white border-none cursor-pointer p-2 rounded-full transition-all group-hover:opacity-100"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIndex((index - 1 + produto.images.length) % produto.images.length);
                                            }}
                                            aria-label="Imagem anterior"
                                        >
                                            ‹
                                        </button>
                                        <button
                                            className="next absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/70 hover:bg-black text-white border-none cursor-pointer p-2 rounded-full transition-all group-hover:opacity-100"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIndex((index + 1) % produto.images.length);
                                            }}
                                            aria-label="Próxima imagem"
                                        >
                                            ›
                                        </button>

                                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                                            {produto.images.map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIndex(i);
                                                    }}
                                                    className={`w-2 h-2 rounded-full transition-all ${i === index
                                                            ? 'bg-primary w-4'
                                                            : 'bg-gray-300 hover:bg-gray-400'
                                                        }`}
                                                    aria-label={`Ir para imagem ${i + 1}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="content p-4 flex flex-col gap-2">
                                <h3 className="text-base font-semibold">
                                    {produto.title}
                                </h3>
                                {produto.discount && <p className="discount absolute top-2 right-2 bg-green-600 text-white text-sm px-2 py-1 rounded">{produto.discount}</p>}
                                <div className="item-details">
                                    {produto.previous_price && (
                                        <p className="previous-price line-through text-gray-500">{formatarMoeda(produto.previous_price)}</p>
                                    )}
                                    <p className="current-price font-bold text-lg">{formatarMoeda(produto.current_price)}</p>
                                    <p className="rating text-gray-500 text-sm before:content-['★'] before:text-yellow-400 before:mr-1">{produto.rating} {produto.rating_text}</p>
                                </div>
                                <div className="actions flex justify-between items-center">
                                    <a href={produto.url} target="_blank" className="bg-[var(--primary)] text-[var(--secondary)] px-4 py-2 rounded hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300">Mercado Livre</a>
                                    {user ? (
                                        <button onClick={modalCriarAlerta} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">Me avise</button>
                                    ) : (
                                        <a href="/login" className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">Faça login</a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id='modal-criar-alerta' className='hidden fixed inset-0 bg-black/25 flex items-center justify-center z-50'>
                        <div className='bg-white rounded-lg p-6 w-11/12 max-w-md'>
                            <h2 className='text-xl font-semibold mb-4'>Criar Alerta de Preço</h2>
                            <p className='mb-4'>Escolha um preço para te avisarmos sobre <strong>{produto.title}</strong></p>
                            <NumericFormat
                                value={targetPrice}
                                onValueChange={(values) => setTargetPrice(values.floatValue)}
                                className='w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-300'
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
                            <div className='flex justify-end'>
                                <button onClick={modalCriarAlerta} className='bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 mr-2'>Cancelar</button>
                                <button onClick={() => criarAlerta(produto)} className='bg-[var(--primary)] text-[var(--secondary)] px-4 py-2 rounded hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300'>Criar Alerta</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

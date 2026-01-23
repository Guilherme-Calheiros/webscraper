'use client';

import React, { useEffect } from 'react';
import Card from '../../components/Card';
import { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { DotsLoading } from '@/app/components/LoadingIndicator';
import { Header } from '@/app/components/Header';
import { Button } from '@/app/components/ui/button';
import { toast } from 'sonner';

export default function Busca() {
    const { query } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [results, setResults] = useState(null);
    const [lastPage, setLastPage] = useState(null);

    async function carregarPagina(pagina = 1) {
        setLoading(true);
        setPosts([]);
        const url =  `/api/scrape`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, page: pagina })
        });

        const data = await response.json();

        if(data.error){
            toast.error(`Erro ao buscar os produtos: ${data.error}`);
            setLoading(false);
            return;
        }

        if (data.blocked) {
            toast.error('Mercado Livre bloqueou a busca por este produto.');
            setLoading(false);
            return;
        }

        setPosts(data.posts);
        setLastPage(data.last_page ?? null);
        setResults(data.results_count ?? null);
        setLoading(false);
    }

    useEffect(() => {
        if (!query) return;
        setPosts([]);
        setResults(null);
        carregarPagina(page);
    }, [query, page]);

    return (
        <div>
            <Header />

            <div className='p-4'>    
                <h2>Resultados para: {decodeURIComponent(query)} ({results ?? 0} resultados)</h2>
                {loading ? (
                    <div className='flex justify-center items-center min-h-96'>
                        <DotsLoading />
                    </div>
                ) : (
                    <>
                        <div id="cards" className="grid [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))] mx-auto gap-6 p-5 max-w-[1280px]">
                            {posts.map(post => (
                                <Card key={post.url} post={post} />
                            ))}
                        </div>
                        <div className='flex items-center justify-center gap-4'>
                            <Button disabled={loading || page <= 1} onClick={() => router.push(`/busca/${encodeURIComponent(query)}?page=${parseInt(page) - 1}`)}>
                                Anterior
                            </Button>

                            <p>Página {page} de {lastPage}</p>

                            <Button disabled={loading || page >= lastPage} onClick={() => router.push(`/busca/${encodeURIComponent(query)}?page=${parseInt(page) + 1}`)}>
                                Próxima
                            </Button>
                        </div>
                    </>
                )}
            </div>


        </div>
  );
}
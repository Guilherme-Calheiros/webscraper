'use client';

import React, { useEffect } from 'react';
import Card from '../../components/Card';
import { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

export default function Busca() {
    const { query } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    
    const [loading, setLoading] = useState(false);
    const [novaBusca, setNovaBusca] = useState(decodeURIComponent(query));
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
            body: JSON.stringify({ query, page })
        });

        const data = await response.json();

        setPosts(data.posts);
        setLastPage(data.last_page ?? null);
        setResults(data.results_count ?? null);
        setLoading(false);
    }

    useEffect(() => {
        setNovaBusca(decodeURIComponent(query));
        carregarPagina(page);
    }, [query, page]);

    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    router.push(`/busca/${encodeURIComponent(novaBusca)}?page=1`);
                }}
            >
                <input className='bg-white text-black px-3.5 py-4 text-base border-0 rounded-s-md focus:outline-none w-72' value={novaBusca} onChange={(e) => setNovaBusca(e.target.value)} />
                <button className='cursor-pointer bg-[var(--primary)] text-[var(--secondary)] px-6 py-4 text-base font-semibold rounded-e-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300'>Buscar</button>
            </form>

            <h2>Resultados para: {decodeURIComponent(query)} ({results ?? 0} resultados)</h2>

            {loading ? (
                <p className="text-center py-10 opacity-60">Carregando resultados…</p>
            ) : (
                <div id="cards" className="grid [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))] mx-auto gap-6 p-5 max-w-[1280px]">
                    {posts.map(post => (
                        <Card key={post.url} post={post} />
                    ))}
                </div>
            )}

            <button disabled={loading || page <= 1} onClick={() => router.push(`/busca/${encodeURIComponent(query)}?page=${parseInt(page) - 1}`)}>
                Anterior
            </button>

            <button disabled={loading || page >= lastPage} onClick={() => router.push(`/busca/${encodeURIComponent(query)}?page=${parseInt(page) + 1}`)}>
                Próxima
            </button>
        </div>
  );
}
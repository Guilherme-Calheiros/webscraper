'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { extrairMLB } from '@/app/utils/regex';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';

export default function Home() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    function handleSubmit(e) {
        e.preventDefault();

        const valor = query.trim();
        const MLB = extrairMLB(valor);
        if (MLB) {
            router.push(`/produto/${MLB}?url=${encodeURIComponent(query)}`);
            return;
        }

        router.push(`/busca/${encodeURIComponent(query)}?page=1`);
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header search={false} />
            <div id="hero" className='flex-1 bg-[var(--secondary)] text-white p-5 md:px-20 w-full grid md:grid-cols-2 gap-10 md:items-center justify-items-center'>
                <div id="hero-content" className="max-w-2xl">
                    <h1 className='text-5xl md:text-6xl font-extrabold leading-tight'>
                        Monitore os preços no <span className='text-[var(--primary)]'>Mercado Livre</span>
                    </h1>

                    <p className='mt-6 mb-12 text-lg md:text-xl text-[var(--muted-foreground)]'>
                        Busque um produto e acompanhe a variação de preço em tempo real.
                    </p>

                    <SearchBar 
                        value={query} 
                        onChange={(e) => setQuery(e.target.value)} 
                        onSubmit={handleSubmit} 
                    />
                </div>

                <div id='hero-image' className='hidden md:flex items-center justify-center'>
                    <img 
                        src="/images/hero-image.png" 
                        alt="Imagem ilustrativa de monitoramento de preços"
                        className="w-full max-w-lg drop-shadow-2xl animate-float"
                    />
                </div>
            </div>
        </div>
    );
}
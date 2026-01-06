'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/app/utils/auth-client';
import { useAuth } from '../providers/AuthProvider';

export default function LoginPage() {
    const router = useRouter();
    const { refreshUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
            
        const { data, error } = await authClient.signIn.email({
            email,
            password,
        }, {
            onRequest: (ctx) => {},
            onSuccess: async (ctx) => {
                console.log('Login successful:', ctx);
                await refreshUser();
                router.back();
            },
            onError: (ctx) => {
                setError(ctx.error.message || 'Erro ao registrar');
            },
        });
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow">
                    <h2 className="text-2xl font-bold text-center">Login</h2>
                    {error && <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Senha</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            />
                        </div>
                        <div className="text-sm text-center">
                            <a href="/register" className="text-blue-600 hover:underline">Não tem uma conta? Registre-se</a>
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 font-bold text-white bg-[var(--secondary)] rounded hover:bg-[var(--primary)] focus:outline-none focus:ring"
                        >
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
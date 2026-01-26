'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/app/utils/auth-client';
import { Header } from '../components/Header';
import { toast } from 'sonner';
import { registerSchema } from '@/schema/register.schema';
import PasswordInput from '../components/PasswordInput';

export default function LoginPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        const result = registerSchema.safeParse({
            name,
            email,
            password,
            confirmPassword,
        });

        if (!result.success) {
            result.error.issues.forEach(issue => {
                toast.error(issue.message);
            });
            return;
        }

        const { data, error } = await authClient.signUp.email({
            name,
            email,
            password,
        }, {
            onSuccess: (ctx) => {
                toast('Registro bem-sucedido!');
                router.back();
            },
            onError: (ctx) => {
                toast.error(ctx.error.message || 'Erro ao registrar');
            },
        });
    }

    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow">
                    <h2 className="text-2xl font-bold text-center">Registre-se</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Nome</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Senha</label>
                            <PasswordInput
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-700">Confirmar Senha</label>
                            <PasswordInput
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div className='flex items-center justify-center'>
                            <p className="text-sm text-gray-600">Já tem uma conta? <a href="/login" className="text-[var(--secondary)] hover:underline">Entrar</a></p>
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 font-bold text-white bg-[var(--secondary)] rounded hover:bg-[var(--primary)] focus:outline-none focus:ring"
                        >
                            Registrar
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
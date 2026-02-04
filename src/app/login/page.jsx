'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/app/utils/auth-client';
import { useAuth } from '../providers/AuthProvider';
import { Header } from '../components/Header';
import { loginSchema } from '@/schema/login.schema';
import { toast } from 'sonner';
import PasswordInput from '../components/PasswordInput';

export default function LoginPage() {
    const router = useRouter();
    const { refreshUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleForgotPassword() {
        await authClient.requestPasswordReset({
            email,
            redirectTo: `${window.location.origin}/reset-password`
        })

        toast('Se um usuário com esse email existir, um email de redefinição de senha foi enviado.');
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const result = loginSchema.safeParse({ email, password });

        if (!result.success) {
            result.error.issues.forEach(issue => {
                toast.error(issue.message);
            });
            return;
        }
            
        const { data, error } = await authClient.signIn.email({
            email,
            password,
        }, {
            onRequest: (ctx) => {},
            onSuccess: async (ctx) => {
                toast('Login realizado com sucesso!');
                await refreshUser();
                router.back();
            },
            onError: (ctx) => {
                if (ctx.error.status === 401) {
                    toast.error('Email ou senha incorretos.');
                    return;
                }

                toast.error(ctx.error.message || 'Erro ao realizar o login.');
            },
        });
    }

    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow">
                    <h2 className="text-2xl font-bold text-center">Login</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                            <p className="text-sm text-[var(--secondary)] hover:underline cursor-pointer" onClick={handleForgotPassword}>Esqueci a senha</p>
                        </div>
                        <div className='flex items-center justify-center'>
                            <p className="text-sm text-gray-600">Não tem uma conta? <a href="/register" className="text-[var(--secondary)] hover:underline">Registrar</a></p>
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
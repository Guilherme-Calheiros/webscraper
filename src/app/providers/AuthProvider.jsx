'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "../utils/auth-client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSession() {
            const { data, error } = await authClient.getSession();
            if (!error) setUser(data?.user ?? null);
            setLoading(false);
        }
        loadSession();
    }, []);

    async function logout() {
        await authClient.signOut();
        setUser(null);
    }

    async function refreshUser() {
        const { data, error } = await authClient.getSession();
        if (!error) setUser(data?.user ?? null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
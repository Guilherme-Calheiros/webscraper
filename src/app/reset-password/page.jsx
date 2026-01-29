"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "../utils/auth-client";
import { toast } from "sonner";
import PasswordInput from "../components/PasswordInput";

export default function ResetPasswordPage() {
  const [token, setToken] = useState(null);
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenUrl = params.get("token");

    if (!tokenUrl) {
      toast("Token inválido ou expirado");
      router.replace("/login");
      return;
    }

    setToken(tokenUrl);
  }, [router]);

  async function handleReset() {
    if (!token) return;

    await authClient.resetPassword({
      token,
      newPassword: password,
    });

    toast("Senha alterada com sucesso!");
    router.push("/login");
  }

  if (!token) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow">
          <h1 className="text-2xl font-bold text-center">Nova senha</h1>
          <PasswordInput
            value={password}
            placeholder="Digite sua nova senha"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleReset} className="w-full px-4 py-2 font-bold text-white bg-[var(--secondary)] rounded hover:bg-[var(--primary)] focus:outline-none focus:ring">Salvar</button>
      </div>
    </div>
  );
}

'use client';

import { useState } from "react";
import { Header } from "../components/Header";
import { authClient } from "../utils/auth-client";
import { useAuth } from "../providers/AuthProvider";
import { useRouter } from "next/navigation";
import { perfilSchema } from "@/schema/perfil.schema";
import { toast } from "sonner";
import PasswordInput from "../components/PasswordInput";

export default function PerfilClient({ user }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const { refreshUser } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    const result = perfilSchema.safeParse({
      name,
      email,
      oldPassword,
      newPassword,
    });

    if (!result.success) {
      result.error.issues.forEach(issue => {
        toast.error(issue.message);
      });
      return;
    }

    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const response = await authClient.changeEmail({ newEmail: email });

      if (response.error) {
        toast.error('Erro ao atualizar o email: ' + response.error.message);
        return;
      }

      router.refresh();
      await refreshUser();
      toast('Email atualizado com sucesso!');
    }

    if (name && name !== user.name) {
      const response = await authClient.updateUser({ name });

      if (response.error) {
        toast.error('Erro ao atualizar o nome: ' + response.error.message);
        return;
      }

      router.refresh();
      await refreshUser();
      toast('Nome atualizado com sucesso!');
    }

    if (newPassword) {
      await authClient.changePassword(
        {
          newPassword,
          currentPassword: oldPassword,
          revokeOtherSessions: true,
        },
        {
          onSuccess: async () => {
            router.refresh();
            await refreshUser();
            toast('Senha atualizada com sucesso!');
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || 'Erro ao atualizar a senha');
          },
        }
      );
    }
  }

  return (
    <>
      <Header />
      <div className="max-w-xl p-6">
        <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nome</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Senha Atual</label>
            <PasswordInput
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Senha</label>
            <PasswordInput
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button className="bg-secondary text-white px-4 py-2 rounded">
            Salvar
          </button>
        </form>
      </div>
    </>
  );
}

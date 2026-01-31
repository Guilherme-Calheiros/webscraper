'use client';

import { useState } from "react";
import { Header } from "../components/Header";
import { authClient } from "../utils/auth-client";
import { useAuth } from "../providers/AuthProvider";
import { useRouter } from "next/navigation";
import { perfilSchema } from "@/schema/perfil.schema";
import { toast } from "sonner";
import PasswordInput from "../components/PasswordInput";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { AlertTriangle, Trash2, Save, Mail, Lock, User } from "lucide-react";

export default function PerfilClient({ user }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const { refreshUser, logout } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
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

      let hasChanges = false;

      if (email && email.toLowerCase() !== user.email.toLowerCase()) {
        const response = await authClient.changeEmail({ newEmail: email });

        if (response.error) {
          toast.error('Erro ao atualizar o email: ' + response.error.message);
          return;
        }

        hasChanges = true;
        toast.success('Email atualizado! Verifique sua caixa de entrada.');
      }

      if (name && name !== user.name) {
        const response = await authClient.updateUser({ name });

        if (response.error) {
          toast.error('Erro ao atualizar o nome: ' + response.error.message);
          return;
        }

        hasChanges = true;
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
              hasChanges = true;
              setOldPassword("");
              setNewPassword("");
            },
            onError: (ctx) => {
              toast.error(ctx.error.message || 'Erro ao atualizar a senha');
            },
          }
        );
      }

      if (hasChanges) {
        await refreshUser();
        router.refresh();
        toast.success('Perfil atualizado com sucesso!');
      } else {
        toast.info('Nenhuma alteração detectada');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirmText !== "EXCLUIR") {
      toast.error('Digite "EXCLUIR" para confirmar');
      return;
    }

    try {
      const response = await authClient.deleteUser();
      if (response.error) {
        toast.error('Erro ao excluir conta: ' + response.error.message);
        return;
      }

      toast.success('Email de confirmação de exclusão enviado!');
      await logout();
    } catch (error) {
      toast.error('Erro ao excluir conta');
    }
  }

  return (
    <>
      <Header />
      <button onClick={() => toast('ola')}>
        marreta
      </button>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
            <p className="text-gray-600 mt-2">Gerencie suas informações pessoais e configurações de segurança</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Informações Pessoais</h2>
                    <p className="text-sm text-gray-500">Atualize seus dados básicos</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Segurança</h2>
                    <p className="text-sm text-gray-500">Altere sua senha de acesso</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha Atual
                    </label>
                    <PasswordInput
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Digite sua senha atual"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nova Senha
                    </label>
                    <PasswordInput
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Digite a nova senha"
                    />
                    <p className="text-xs text-gray-500 mt-1">Mínimo de 8 caracteres</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Suas alterações serão salvas após confirmar
                  </p>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90 text-secondary gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              </div>
            </form>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-sm border border-red-200">
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Zona de Perigo</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Excluir sua conta é uma ação permanente e não pode ser desfeita. Todos os seus alertas serão perdidos.
                  </p>
                  
                  <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="gap-2">
                        <Trash2 className="w-4 h-4" />
                        Excluir Minha Conta
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="w-5 h-5" />
                          Confirmar Exclusão de Conta
                        </DialogTitle>
                        <DialogDescription className="space-y-3 pt-4">
                          <p className="text-gray-700">
                            Esta ação é <strong>permanente e irreversível</strong>. Ao excluir sua conta:
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-2">
                            <li>Todos os seus alertas serão excluídos</li>
                            <li>Seu histórico de preços será perdido</li>
                            <li>Você não poderá recuperar estes dados</li>
                          </ul>
                          <div className="pt-4 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Digite <span className="font-bold text-red-600">EXCLUIR</span> para confirmar:
                            </label>
                            <input
                              type="text"
                              value={deleteConfirmText}
                              onChange={(e) => setDeleteConfirmText(e.target.value)}
                              placeholder="EXCLUIR"
                              className="text-black w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
                            />
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="gap-2">
                        <DialogClose asChild>
                          <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteAccount}
                          disabled={deleteConfirmText !== "EXCLUIR"}
                        >
                          Sim, Excluir Minha Conta
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
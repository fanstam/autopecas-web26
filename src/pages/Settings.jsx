import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api";
import { toast } from "sonner";
import { Loader2, Settings as SettingsIcon, User, Lock, Building, ShieldCheck } from "lucide-react";

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Estados dos formulários
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    businessName: user?.businessName || ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      // Atualiza na API
      const response = await api.put("/users/profile", profileForm);
      // Atualiza no Contexto Global para mudar o nome no Header/Sidebar na hora
      if (updateProfile) updateProfile(response.data);
      toast.success("Perfil atualizado com sucesso!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Erro ao atualizar dados do perfil.");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("A nova senha e a confirmação não conferem!");
      return;
    }

    setLoadingPassword(true);
    try {
      await api.put("/users/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success("Senha alterada com sucesso!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Erro ao atualizar senha. Verifique a senha atual.");
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto fade-up">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-[#E4002B]" />
          Configurações
        </h1>
        <p className="text-zinc-400 mt-1">Gerencie suas credenciais de acesso e informações do sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Formulário de Dados do Perfil */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
            <User className="w-4 h-4 text-zinc-400" />
            Dados da Conta
          </h2>

          <form onSubmit={handleUpdateProfile} className="space-y-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">Nome do Usuário</label>
              <input required value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#E4002B] text-sm" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">E-mail de Acesso</label>
              <input required type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#E4002B] text-sm" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">Nome do Estabelecimento / Oficina</label>
              <div className="relative">
                <Building className="w-4 h-4 text-zinc-600 absolute left-3 top-3.5" />
                <input value={profileForm.businessName} onChange={(e) => setProfileForm({ ...profileForm, businessName: e.target.value })} placeholder="Ex: Auto Peças Honda Moto" className="w-full bg-[#111] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-white outline-none focus:border-[#E4002B] text-sm" />
              </div>
            </div>

            <button type="submit" disabled={loadingProfile} className="bg-[#E4002B] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#C80025] transition-colors flex items-center gap-1.5">
              {loadingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar Alterações"}
            </button>
          </form>
        </div>

        {/* Formulário de Alteração de Senha */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
            <Lock className="w-4 h-4 text-zinc-400" />
            Segurança & Senha
          </h2>

          <form onSubmit={handleUpdatePassword} className="space-y-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">Senha Atual</label>
              <input required type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#E4002B] text-sm" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">Nova Senha</label>
              <input required type="password" minLength={6} value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#E4002B] text-sm" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">Confirmar Nova Senha</label>
              <input required type="password" minLength={6} value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#E4002B] text-sm" />
            </div>

            <button type="submit" disabled={loadingPassword} className="bg-zinc-900 border border-white/10 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors flex items-center gap-1.5">
              {loadingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : "Atualizar Senha"}
            </button>
          </form>
        </div>
      </div>

      {/* Card Informativo de Licença */}
      <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-white">Status do Sistema: Ativo</h4>
          <p className="text-xs text-zinc-400 mt-0.5">Sua conta possui acesso completo a todos os módulos de estoque, fluxo de caixa, gerenciamento de ordens de serviço e faturamento da oficina.</p>
        </div>
      </div>
    </div>
  );
}

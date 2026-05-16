import { useAuth } from "../contexts/AuthContext";
import { CreditCard, LogOut, MessageSquare, AlertTriangle } from "lucide-react";

export default function SubscriptionExpired() {
  const { logout, user } = useAuth();

  const handleSupportClick = () => {
    // Redireciona para o WhatsApp de suporte (substitua pelo seu número se desejar)
    const message = encodeURIComponent(`Olá! Meu período de teste ou assinatura no sistema Auto Peças Honda expirou. Gostaria de realizar a renovação para o usuário: ${user?.email}`);
    window.open(`https://wa.me/5592999999999?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 relative">
      <div className="absolute inset-0 red-ambient pointer-events-none" />
      
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 text-center space-y-6 shadow-[0_0_50px_rgba(228,0,43,0.05)] fade-up">
        {/* Ícone de Alerta */}
        <div className="w-16 h-16 rounded-2xl bg-[#E4002B]/10 text-[#E4002B] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(228,0,43,0.15)]">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Texto Principal */}
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-bold text-white tracking-tight">
            Sua licença expirou!
          </h1>
          <p className="text-sm text-zinc-400">
            O período de teste ou a sua mensalidade do sistema **Auto Peças Honda** chegou ao fim. Para continuar usando os módulos de estoque, caixa e agendamentos, realize a renovação.
          </p>
        </div>

        {/* Informações da Oficina */}
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 text-left text-xs text-zinc-500 space-y-1">
          <div><span className="font-semibold text-zinc-400">Usuário:</span> {user?.name}</div>
          <div><span className="font-semibold text-zinc-400">E-mail:</span> {user?.email}</div>
          <div><span className="font-semibold text-zinc-400">Empresa:</span> {user?.businessName || "Não informada"}</div>
        </div>

        {/* Botões de Ação */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleSupportClick}
            className="w-full bg-[#E4002B] hover:bg-[#C80025] text-white font-semibold py-3 rounded-lg shadow-[0_0_15px_rgba(228,0,43,0.2)] transition-all flex items-center justify-center gap-2 group"
          >
            <CreditCard className="w-4 h-4" /> Renovar via WhatsApp / PIX
          </button>

          <button
            onClick={logout}
            className="w-full bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-400 hover:text-white py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sair da conta
          </button>
        </div>

        <p className="text-xs text-zinc-600">
          Se você acabou de realizar o pagamento, aguarde alguns minutos até a compensação automática do administrador.
        </p>
      </div>
    </div>
  );
}

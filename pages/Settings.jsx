import { useAuth } from "@/contexts/AuthContext";

export default function Settings() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[#E4002B] font-medium mb-2">Conta</p>
        <h1 className="font-heading text-4xl font-semibold tracking-tighter">Configurações</h1>
      </div>

      <div className="rounded-xl bg-[#0F0F0F] border border-white/10 p-6 max-w-2xl">
        <h2 className="font-heading text-xl font-medium mb-5">Perfil</h2>
        <div className="space-y-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Nome</div>
            <div className="text-white">{user?.name}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Email</div>
            <div className="text-white">{user?.email}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Telefone</div>
            <div className="text-white">{user?.phone || "—"}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Tipo de conta</div>
            <div className="text-white capitalize">{user?.role}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Vencimento da assinatura</div>
            <div className="text-white">{user?.subscription_expiry ? new Date(user.subscription_expiry).toLocaleDateString("pt-BR") : "—"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

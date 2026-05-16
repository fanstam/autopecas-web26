import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { toast } from "sonner";
import { Loader2, Shield, CreditCard, Check, X, Search, Calendar } from "lucide-react";

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadSubscriptions();
  }, []);

  async function loadSubscriptions() {
    try {
      const response = await api.get("/admin/subscriptions");
      setSubscriptions(response.data);
    } catch (err) {
      toast.error("Erro ao carregar controle de assinaturas.");
    } finally {
      setLoading(false);
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      await api.patch(`/admin/subscriptions/${id}/status`, { status: newStatus });
      toast.success(`Assinatura atualizada para ${newStatus === "ACTIVE" ? "Ativa" : "Suspensa"}!`);
      loadSubscriptions();
    } catch (err) {
      toast.error("Erro ao alterar status da assinatura.");
    }
  };

  const filteredSubscriptions = subscriptions.filter((s) =>
    s.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.user?.businessName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto fade-up">
      {/* Topo */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-white tracking-tight flex items-center gap-2">
          <Shield className="w-7 h-7 text-[#E4002B]" />
          Painel Administrativo: Assinaturas
        </h1>
        <p className="text-zinc-400 mt-1">Gerencie as licenças de uso, pagamentos e bloqueios de usuários do sistema.</p>
      </div>

      {/* Busca */}
      <div className="flex items-center gap-3 bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 max-w-md">
        <Search className="w-5 h-5 text-zinc-500" />
        <input
          type="text"
          placeholder="Buscar por cliente ou oficina..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-white placeholder-zinc-600 outline-none w-full text-sm"
        />
      </div>

      {/* Tabela de Assinantes */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#E4002B]" />
        </div>
      ) : filteredSubscriptions.length === 0 ? (
        <div className="border border-white/5 bg-[#0a0a0a] rounded-xl p-12 text-center text-zinc-500 flex flex-col items-center gap-3">
          <CreditCard className="w-12 h-12 text-zinc-700" />
          <p>Nenhuma assinatura ou licença localizada.</p>
        </div>
      ) : (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm text-zinc-300">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-zinc-400 font-medium">
                  <th className="p-4">Assinante / Empresa</th>
                  <th className="p-4">Plano</th>
                  <th className="p-4">Vencimento</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSubscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-white">{sub.user?.name}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">{sub.user?.businessName || "Oficina não informada"}</div>
                    </td>
                    <td className="p-4 text-zinc-400 font-medium">{sub.planName || "Mensal Premium"}</td>
                    <td className="p-4 text-zinc-400">
                      <span className="flex items-center gap-1.5 text-zinc-400">
                        <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                        {sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString("pt-BR") : "---"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${sub.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                        {sub.status === "ACTIVE" ? "Ativo" : "Suspenso"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(sub.id, sub.status)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${sub.status === "ACTIVE" ? "border-red-500/20 text-red-400 hover:bg-red-500/10" : "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"}`}
                      >
                        {sub.status === "ACTIVE" ? "Suspender Acesso" : "Ativar Acesso"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

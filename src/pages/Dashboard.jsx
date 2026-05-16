import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api";
import { toast } from "sonner";
import { 
  TrendingUp, 
  Package, 
  Users, 
  Calendar, 
  DollarSign, 
  AlertTriangle,
  Loader2,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const response = await api.get("/metrics/dashboard");
        setMetrics(response.data);
      } catch (err) {
        toast.error("Erro ao carregar dados do painel.");
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#E4002B]" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto fade-up">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-white tracking-tight">
          Olá, {user?.name || "Gestor"} 👋
        </h1>
        <p className="text-zinc-400 mt-1">
          Aqui está o resumo em tempo real da sua oficina de Auto Peças Honda.
        </p>
      </div>

      {/* Grid de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Vendas do Mês */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 relative overflow-hidden group hover:border-[#E4002B]/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +12.5%
            </span>
          </div>
          <div className="text-zinc-400 text-sm font-medium">Vendas (Mês)</div>
          <div className="text-2xl font-bold text-white mt-1">
            R$ {metrics?.monthlySales?.toFixed(2) || "0,00"}
          </div>
        </div>

        {/* Produtos em Stock */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 relative overflow-hidden group hover:border-[#E4002B]/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-zinc-400 text-sm font-medium">Produtos em Stock</div>
          <div className="text-2xl font-bold text-white mt-1">
            {metrics?.totalProducts || 0}
          </div>
        </div>

        {/* Clientes Atendidos */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 relative overflow-hidden group hover:border-[#E4002B]/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-zinc-400 text-sm font-medium">Clientes Cadastrados</div>
          <div className="text-2xl font-bold text-white mt-1">
            {metrics?.totalCustomers || 0}
          </div>
        </div>

        {/* Agendamentos de Hoje */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 relative overflow-hidden group hover:border-[#E4002B]/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-[#E4002B]/10 text-[#E4002B]">
              <Calendar className="w-5 h-5" />
            </div>
            {metrics?.lowStockCount > 0 && (
              <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {metrics.lowStockCount} alertas
              </span>
            )}
          </div>
          <div className="text-zinc-400 text-sm font-medium">Agendamentos (Hoje)</div>
          <div className="text-2xl font-bold text-white mt-1">
            {metrics?.todayAppointments || 0}
          </div>
        </div>
      </div>

      {/* Alertas de Stock Baixo */}
      {metrics?.lowStockProducts?.length > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
          <div className="flex items-center gap-2 text-amber-500 font-semibold mb-3">
            <AlertTriangle className="w-5 h-5" />
            Aviso de Stock Crítico
          </div>
          <div className="divide-y divide-white/5">
            {metrics.lowStockProducts.map((product) => (
              <div key={product.id} className="py-2.5 flex justify-between text-sm">
                <span className="text-zinc-300">{product.name}</span>
                <span className="text-amber-500 font-medium">{product.stock} un. restantes</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

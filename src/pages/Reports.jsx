import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { toast } from "sonner";
import { Loader2, FileText, Download, BarChart3, PieChart, TrendingUp } from "lucide-react";

export default function Reports() {
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30"); // 30 dias por padrão

  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      try {
        const response = await api.get(`/metrics/reports?days=${period}`);
        setReportsData(response.data);
      } catch (err) {
        toast.error("Erro ao gerar relatórios do sistema.");
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, [period]);

  const handleExport = () => {
    toast.success("Preparando download do relatório em PDF/CSV...");
    // Futura lógica de exportação aqui
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto fade-up">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white tracking-tight">Relatórios & Insights</h1>
          <p className="text-zinc-400 mt-1">Analise a evolução das vendas e serviços da oficina.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#E4002B] text-sm font-medium"
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
          </select>
          
          <button
            onClick={handleExport}
            className="border border-white/10 hover:bg-white/5 text-white px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" /> Exportar Dados
          </button>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#E4002B]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico / Resumo de Faturamento */}
          <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-xl p-5 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#E4002B]" />
              Desempenho Comercial no Período
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-white/[0.01] border border-white/5 rounded-lg p-4">
                <span className="text-xs text-zinc-500 font-medium">Faturamento Bruto</span>
                <p className="text-xl font-bold text-white mt-1">R$ {reportsData?.totalRevenue?.toFixed(2) || "0,00"}</p>
              </div>
              <div className="bg-white/[0.01] border border-white/5 rounded-lg p-4">
                <span className="text-xs text-zinc-500 font-medium">Ordens Concluídas</span>
                <p className="text-xl font-bold text-white mt-1">{reportsData?.completedAppointmentsCount || 0} serv.</p>
              </div>
              <div className="bg-white/[0.01] border border-white/5 rounded-lg p-4 col-span-2 sm:col-span-1">
                <span className="text-xs text-zinc-500 font-medium">Ticket Médio por Venda</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">R$ {reportsData?.ticketAverage?.toFixed(2) || "0,00"}</p>
              </div>
            </div>

            <div className="h-48 border border-white/5 bg-white/[0.01] rounded-lg flex items-center justify-center text-zinc-600 text-sm">
              <TrendingUp className="w-4 h-4 mr-2 text-zinc-700" /> Gráfico de evolução de caixa em desenvolvimento
            </div>
          </div>

          {/* Produtos mais vendidos */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-zinc-400" />
              Peças Mais Vendidas
            </h2>

            <div className="divide-y divide-white/5 pt-2">
              {!reportsData?.topProducts || reportsData.topProducts.length === 0 ? (
                <p className="text-sm text-zinc-600 text-center py-12">Sem dados de movimentação de peças.</p>
              ) : (
                reportsData.topProducts.map((item, idx) => (
                  <div key={idx} className="py-3 flex justify-between items-center text-sm">
                    <div className="max-w-[70%]">
                      <p className="font-medium text-white line-clamp-1">{item.name}</p>
                      <span className="text-xs text-zinc-500">SKU: {item.sku}</span>
                    </div>
                    <span className="font-semibold text-zinc-300 bg-white/5 border border-white/5 px-2 py-0.5 rounded text-xs">
                      {item.totalQty} un. sold
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

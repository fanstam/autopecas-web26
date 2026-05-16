import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";
import { TrendingUp, DollarSign, Boxes, CalendarDays, AlertTriangle, ArrowUpRight } from "lucide-react";

const Card = ({ title, value, sub, icon: Icon, accent, testid }) => (
  <div data-testid={testid} className="group relative rounded-xl bg-[#0F0F0F] border border-white/10 p-5 hover:-translate-y-0.5 hover:border-[#E4002B]/40 transition-all">
    <div className="flex items-start justify-between">
      <div>
        <div className="text-xs uppercase tracking-widest text-zinc-500 font-medium">{title}</div>
        <div className="font-heading text-3xl font-semibold tracking-tighter text-white mt-2">{value}</div>
        {sub && <div className="text-xs text-zinc-500 mt-2">{sub}</div>}
      </div>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent || "bg-[#E4002B]/10 text-[#E4002B]"}`}>
        <Icon className="w-5 h-5" strokeWidth={1.5} />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => { api.get("/dashboard/stats").then(r => setStats(r.data)).catch(() => {}); }, []);

  if (!stats) return <div className="text-zinc-500">Carregando...</div>;

  const fmtBRL = (v) => "R$ " + Number(v).toFixed(2).replace(".", ",");

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#E4002B] font-medium mb-2">Painel Geral</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-semibold tracking-tighter">Dashboard</h1>
          <p className="text-zinc-400 mt-2">Visão completa do seu negócio em tempo real.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card testid="stat-sales-today" title="Vendas Hoje" value={stats.sales_today_count} sub={fmtBRL(stats.revenue_today)} icon={TrendingUp} />
        <Card testid="stat-revenue-month" title="Faturamento Mensal" value={fmtBRL(stats.revenue_month)} sub="Últimos 30 dias" icon={DollarSign} />
        <Card testid="stat-stock" title="Produtos em Estoque" value={stats.total_stock} sub={`${stats.low_stock_count} com estoque baixo`} icon={Boxes} />
        <Card testid="stat-appointments" title="Agendamentos Hoje" value={stats.appointments_today} sub="Confirmados + pendentes" icon={CalendarDays} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-xl bg-[#0F0F0F] border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading text-xl font-medium">Faturamento — 7 dias</h2>
              <p className="text-xs text-zinc-500 mt-1">Evolução recente</p>
            </div>
            <div className="text-xs text-zinc-400 flex items-center gap-1"><ArrowUpRight className="w-3.5 h-3.5 text-[#E4002B]" /> tempo real</div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={stats.chart}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E4002B" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#E4002B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1f1f1f" />
              <XAxis dataKey="day" stroke="#666" fontSize={11} />
              <YAxis stroke="#666" fontSize={11} />
              <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: 8 }} labelStyle={{ color: "#fff" }} />
              <Line type="monotone" dataKey="revenue" stroke="#E4002B" strokeWidth={2.5} dot={{ fill: "#E4002B", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl bg-[#0F0F0F] border border-white/10 p-6">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle className="w-4 h-4 text-[#E4002B]" />
            <h2 className="font-heading text-xl font-medium">Estoque baixo</h2>
          </div>
          {stats.low_stock.length === 0 ? (
            <p className="text-sm text-zinc-500">Tudo certo. Nenhum produto com estoque baixo.</p>
          ) : (
            <ul className="space-y-3">
              {stats.low_stock.map((p) => (
                <li key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5">
                  <div>
                    <div className="text-sm font-medium text-white">{p.name}</div>
                    <div className="text-xs text-zinc-500">SKU: {p.sku || "—"}</div>
                  </div>
                  <span className="text-[#E4002B] font-heading font-bold text-lg">{p.stock}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [sales, setSales] = useState([]);
  const [appts, setAppts] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/dashboard/stats"), api.get("/sales"), api.get("/appointments")])
      .then(([s, sa, a]) => { setStats(s.data); setSales(sa.data); setAppts(a.data); });
  }, []);

  if (!stats) return <div className="text-zinc-500">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[#E4002B] font-medium mb-2">Análise</p>
        <h1 className="font-heading text-4xl font-semibold tracking-tighter">Relatórios</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="rounded-xl bg-[#0F0F0F] border border-white/10 p-5"><div className="text-xs uppercase tracking-widest text-zinc-500">Vendas (total)</div><div className="font-heading text-3xl font-bold mt-2">{sales.length}</div></div>
        <div className="rounded-xl bg-[#0F0F0F] border border-white/10 p-5"><div className="text-xs uppercase tracking-widest text-zinc-500">Receita mensal</div><div className="font-heading text-3xl font-bold mt-2">R$ {stats.revenue_month.toFixed(2).replace(".", ",")}</div></div>
        <div className="rounded-xl bg-[#0F0F0F] border border-white/10 p-5"><div className="text-xs uppercase tracking-widest text-zinc-500">Agendamentos</div><div className="font-heading text-3xl font-bold mt-2">{appts.length}</div></div>
        <div className="rounded-xl bg-[#0F0F0F] border border-white/10 p-5"><div className="text-xs uppercase tracking-widest text-zinc-500">Estoque baixo</div><div className="font-heading text-3xl font-bold mt-2 text-[#E4002B]">{stats.low_stock_count}</div></div>
      </div>

      <div className="rounded-xl bg-[#0F0F0F] border border-white/10 p-6">
        <h3 className="font-heading text-xl font-medium mb-5">Receita — últimos 7 dias</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.chart}>
            <CartesianGrid stroke="#1f1f1f" />
            <XAxis dataKey="day" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: 8 }} />
            <Line type="monotone" dataKey="revenue" stroke="#E4002B" strokeWidth={2.5} dot={{ r: 4, fill: "#E4002B" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

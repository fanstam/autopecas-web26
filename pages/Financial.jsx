import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const COLORS = { pix: "#E4002B", dinheiro: "#22C55E", credito: "#F59E0B", debito: "#A1A1AA" };
const LABEL = { pix: "Pix", dinheiro: "Dinheiro", credito: "Crédito", debito: "Débito" };

export default function Financial() {
  const [sales, setSales] = useState([]);
  useEffect(() => { api.get("/sales").then(r => setSales(r.data)); }, []);

  const totalRevenue = sales.reduce((s, x) => s + (x.total || 0), 0);
  const byMethod = ["pix", "dinheiro", "credito", "debito"].map(m => ({
    method: LABEL[m], key: m,
    revenue: sales.filter(s => s.payment_method === m).reduce((a, s) => a + s.total, 0),
  }));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[#E4002B] font-medium mb-2">Resumo</p>
        <h1 className="font-heading text-4xl font-semibold tracking-tighter">Financeiro</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-xl bg-[#0F0F0F] border border-white/10 p-6">
          <div className="text-xs uppercase tracking-widest text-zinc-500">Receita total</div>
          <div className="font-heading text-5xl font-bold mt-2">R$ {totalRevenue.toFixed(2).replace(".", ",")}</div>
          <div className="text-sm text-zinc-500 mt-2">{sales.length} vendas registradas</div>
        </div>
        <div className="rounded-xl bg-[#0F0F0F] border border-white/10 p-6">
          <h3 className="font-heading text-lg font-medium mb-4">Por método</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={byMethod}>
              <CartesianGrid stroke="#1f1f1f" />
              <XAxis dataKey="method" stroke="#666" fontSize={11} />
              <YAxis stroke="#666" fontSize={11} />
              <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: 8 }} />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {byMethod.map((d, i) => <Cell key={i} fill={COLORS[d.key]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0F0F0F] overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10"><h3 className="font-heading text-lg font-medium">Últimas movimentações</h3></div>
        <table className="w-full text-sm">
          <thead className="bg-black/40 text-left text-zinc-500 uppercase text-xs tracking-widest">
            <tr><th className="px-5 py-3">Data</th><th className="px-5 py-3">Cliente</th><th className="px-5 py-3">Método</th><th className="px-5 py-3 text-right">Valor</th></tr>
          </thead>
          <tbody>
            {sales.length === 0 ? <tr><td colSpan={4} className="px-5 py-10 text-center text-zinc-500">Sem movimentações.</td></tr> : sales.slice(0, 20).map(s => (
              <tr key={s.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-5 py-3 text-zinc-400">{new Date(s.date).toLocaleString("pt-BR")}</td>
                <td className="px-5 py-3 font-medium">{s.customer_name || "—"}</td>
                <td className="px-5 py-3"><span className="px-2 py-0.5 rounded-full text-xs uppercase tracking-wider font-bold" style={{ background: COLORS[s.payment_method] + "22", color: COLORS[s.payment_method] }}>{LABEL[s.payment_method]}</span></td>
                <td className="px-5 py-3 text-right font-heading">R$ {Number(s.total).toFixed(2).replace(".", ",")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

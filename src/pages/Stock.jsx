import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { AlertTriangle, Package } from "lucide-react";

export default function Stock() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/products").then(r => setItems(r.data)); }, []);

  const low = items.filter(p => p.stock <= p.min_stock);
  const total = items.reduce((s, p) => s + p.stock, 0);
  const value = items.reduce((s, p) => s + p.stock * p.price, 0);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[#E4002B] font-medium mb-2">Inventário</p>
        <h1 className="font-heading text-4xl font-semibold tracking-tighter">Estoque</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-xl bg-[#0F0F0F] border border-white/10 p-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500"><Package className="w-4 h-4" /> Itens totais</div>
          <div className="font-heading text-3xl font-semibold mt-2">{total}</div>
        </div>
        <div className="rounded-xl bg-[#0F0F0F] border border-white/10 p-5">
          <div className="text-xs uppercase tracking-widest text-zinc-500">Valor em estoque</div>
          <div className="font-heading text-3xl font-semibold mt-2">R$ {value.toFixed(2).replace(".", ",")}</div>
        </div>
        <div className="rounded-xl bg-[#E4002B]/5 border border-[#E4002B]/30 p-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#E4002B]"><AlertTriangle className="w-4 h-4" /> Estoque baixo</div>
          <div className="font-heading text-3xl font-semibold mt-2 text-[#E4002B]">{low.length}</div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0F0F0F] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/40 text-left text-zinc-500 uppercase text-xs tracking-widest">
            <tr><th className="px-5 py-3">Produto</th><th className="px-5 py-3">SKU</th><th className="px-5 py-3 text-right">Estoque</th><th className="px-5 py-3 text-right">Mínimo</th><th className="px-5 py-3 text-right">Status</th></tr>
          </thead>
          <tbody>
            {items.length === 0 ? <tr><td colSpan={5} className="px-5 py-10 text-center text-zinc-500">Sem produtos.</td></tr> : items.map(p => (
              <tr key={p.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-5 py-3 font-medium">{p.name}</td>
                <td className="px-5 py-3 text-zinc-400">{p.sku || "—"}</td>
                <td className="px-5 py-3 text-right font-heading">{p.stock}</td>
                <td className="px-5 py-3 text-right text-zinc-400">{p.min_stock}</td>
                <td className="px-5 py-3 text-right">
                  {p.stock <= p.min_stock ? <span className="px-2.5 py-1 rounded-full bg-[#E4002B]/15 text-[#E4002B] text-xs font-bold uppercase tracking-wider">Baixo</span> : <span className="px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 text-xs font-bold uppercase tracking-wider">OK</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

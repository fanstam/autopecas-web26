import { useEffect, useState } from "react";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";
import { Plus, Trash2, X, Pencil } from "lucide-react";

const empty = { name: "", sku: "", category: "", price: 0, stock: 0, min_stock: 5 };

export default function Products() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const load = async () => setItems((await api.get("/products")).data);
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      if (editing) await api.patch(`/products/${editing}`, form);
      else await api.post("/products", form);
      toast.success("Produto salvo!");
      setOpen(false); setEditing(null); setForm(empty); load();
    } catch (err) { toast.error(formatError(err)); }
  };

  const remove = async (id) => {
    if (!confirm("Excluir produto?")) return;
    await api.delete(`/products/${id}`); load();
  };

  const editProduct = (p) => {
    setForm({ name: p.name, sku: p.sku, category: p.category, price: p.price, stock: p.stock, min_stock: p.min_stock });
    setEditing(p.id); setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#E4002B] font-medium mb-2">Catálogo</p>
          <h1 className="font-heading text-4xl font-semibold tracking-tighter">Produtos</h1>
        </div>
        <button data-testid="new-product-btn" onClick={() => { setForm(empty); setEditing(null); setOpen(true); }} className="bg-[#E4002B] hover:bg-[#C80025] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(228,0,43,0.3)]">
          <Plus className="w-4 h-4" /> Novo Produto
        </button>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0F0F0F] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/40 text-left text-zinc-500 uppercase text-xs tracking-widest">
            <tr><th className="px-5 py-3">Produto</th><th className="px-5 py-3">SKU</th><th className="px-5 py-3">Categoria</th><th className="px-5 py-3 text-right">Preço</th><th className="px-5 py-3 text-right">Estoque</th><th className="px-5 py-3"></th></tr>
          </thead>
          <tbody>
            {items.length === 0 ? <tr><td colSpan={6} className="px-5 py-10 text-center text-zinc-500">Nenhum produto cadastrado.</td></tr> : items.map(p => (
              <tr key={p.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-5 py-3 font-medium">{p.name}</td>
                <td className="px-5 py-3 text-zinc-400">{p.sku || "—"}</td>
                <td className="px-5 py-3 text-zinc-400">{p.category || "—"}</td>
                <td className="px-5 py-3 text-right font-heading">R$ {Number(p.price).toFixed(2).replace(".", ",")}</td>
                <td className="px-5 py-3 text-right"><span className={p.stock <= p.min_stock ? "text-[#E4002B] font-bold" : "text-white"}>{p.stock}</span></td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button data-testid={`edit-product-${p.id}`} onClick={() => editProduct(p)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/15 text-zinc-200 hover:border-white/40 hover:bg-white/5 text-xs font-medium transition-all"><Pencil className="w-3.5 h-3.5" /> Editar</button>
                    <button data-testid={`delete-product-${p.id}`} onClick={() => remove(p.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#E4002B]/40 text-[#E4002B] hover:bg-[#E4002B]/10 hover:border-[#E4002B] text-xs font-medium transition-all"><Trash2 className="w-3.5 h-3.5" /> Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-2xl font-semibold">{editing ? "Editar" : "Novo"} Produto</h2>
              <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input data-testid="product-name-input" placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 focus:border-[#E4002B] outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 focus:border-[#E4002B] outline-none" />
                <input placeholder="Categoria" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 focus:border-[#E4002B] outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input data-testid="product-price-input" type="number" step="0.01" placeholder="Preço" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 focus:border-[#E4002B] outline-none" />
                <input data-testid="product-stock-input" type="number" placeholder="Estoque" value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} className="bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 focus:border-[#E4002B] outline-none" />
                <input type="number" placeholder="Mín. estoque" value={form.min_stock} onChange={(e) => setForm({ ...form, min_stock: parseInt(e.target.value) || 0 })} className="bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 focus:border-[#E4002B] outline-none" />
              </div>
              <button data-testid="product-save-btn" onClick={save} className="w-full bg-[#E4002B] hover:bg-[#C80025] text-white py-3 rounded-lg font-medium">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

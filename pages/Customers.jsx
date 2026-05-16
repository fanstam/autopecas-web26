import { useEffect, useState } from "react";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";
import { Plus, Trash2, X } from "lucide-react";

const empty = { name: "", phone: "", email: "", motorcycle_model: "" };

export default function Customers() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const load = async () => setItems((await api.get("/customers")).data);
  useEffect(() => { load(); }, []);

  const save = async () => {
    try { await api.post("/customers", form); toast.success("Cliente salvo!"); setOpen(false); setForm(empty); load(); }
    catch (err) { toast.error(formatError(err)); }
  };
  const remove = async (id) => { if (!confirm("Excluir?")) return; await api.delete(`/customers/${id}`); load(); };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#E4002B] font-medium mb-2">Base</p>
          <h1 className="font-heading text-4xl font-semibold tracking-tighter">Clientes</h1>
        </div>
        <button data-testid="new-customer-btn" onClick={() => { setForm(empty); setOpen(true); }} className="bg-[#E4002B] hover:bg-[#C80025] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(228,0,43,0.3)]">
          <Plus className="w-4 h-4" /> Novo Cliente
        </button>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0F0F0F] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/40 text-left text-zinc-500 uppercase text-xs tracking-widest">
            <tr><th className="px-5 py-3">Nome</th><th className="px-5 py-3">Telefone</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Moto</th><th className="px-5 py-3"></th></tr>
          </thead>
          <tbody>
            {items.length === 0 ? <tr><td colSpan={5} className="px-5 py-10 text-center text-zinc-500">Nenhum cliente.</td></tr> : items.map(c => (
              <tr key={c.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-5 py-3 font-medium">{c.name}</td>
                <td className="px-5 py-3 text-zinc-400">{c.phone || "—"}</td>
                <td className="px-5 py-3 text-zinc-400">{c.email || "—"}</td>
                <td className="px-5 py-3 text-zinc-400">{c.motorcycle_model || "—"}</td>
                <td className="px-5 py-3 text-right"><button data-testid={`delete-customer-${c.id}`} onClick={() => remove(c.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#E4002B]/40 text-[#E4002B] hover:bg-[#E4002B]/10 hover:border-[#E4002B] text-xs font-medium transition-all"><Trash2 className="w-3.5 h-3.5" /> Excluir</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-2xl font-semibold">Novo Cliente</h2>
              <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input data-testid="customer-name-input" placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 focus:border-[#E4002B] outline-none" />
              <input placeholder="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 focus:border-[#E4002B] outline-none" />
              <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 focus:border-[#E4002B] outline-none" />
              <input placeholder="Modelo da moto (ex: CG 160, CB 500)" value={form.motorcycle_model} onChange={(e) => setForm({ ...form, motorcycle_model: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 focus:border-[#E4002B] outline-none" />
              <button data-testid="customer-save-btn" onClick={save} className="w-full bg-[#E4002B] hover:bg-[#C80025] text-white py-3 rounded-lg font-medium">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

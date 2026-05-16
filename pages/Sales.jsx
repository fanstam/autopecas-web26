import { useEffect, useState } from "react";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";
import { Plus, Trash2, X, Search, Pencil } from "lucide-react";

const PAYMENT_LABEL = { pix: "Pix", dinheiro: "Dinheiro", credito: "Crédito", debito: "Débito" };

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null); // sale being edited (only customer/payment)

  const [form, setForm] = useState({ customer_name: "", payment_method: "pix", items: [] });

  const load = async () => {
    const [s, p, c] = await Promise.all([api.get("/sales"), api.get("/products"), api.get("/customers")]);
    setSales(s.data); setProducts(p.data); setCustomers(c.data);
  };
  useEffect(() => { load(); }, []);

  const addItem = (prod) => {
    setForm(f => {
      const existing = f.items.find(i => i.product_id === prod.id);
      if (existing) return { ...f, items: f.items.map(i => i.product_id === prod.id ? { ...i, quantity: i.quantity + 1 } : i) };
      return { ...f, items: [...f.items, { product_id: prod.id, name: prod.name, quantity: 1, price: prod.price }] };
    });
  };
  const removeItem = (pid) => setForm(f => ({ ...f, items: f.items.filter(i => i.product_id !== pid) }));
  const total = form.items.reduce((s, i) => s + i.price * i.quantity, 0);

  const submit = async () => {
    if (editing) {
      try {
        await api.patch(`/sales/${editing.id}`, { customer_name: form.customer_name, payment_method: form.payment_method });
        toast.success("Venda atualizada!");
        setOpen(false); setEditing(null); setForm({ customer_name: "", payment_method: "pix", items: [] });
        load();
      } catch (err) { toast.error(formatError(err)); }
      return;
    }
    if (form.items.length === 0) return toast.error("Adicione produtos");
    try {
      await api.post("/sales", { ...form, total });
      toast.success("Venda registrada!");
      setOpen(false); setForm({ customer_name: "", payment_method: "pix", items: [] });
      load();
    } catch (err) { toast.error(formatError(err)); }
  };

  const startEdit = (s) => {
    setEditing(s);
    setForm({ customer_name: s.customer_name || "", payment_method: s.payment_method, items: s.items || [] });
    setOpen(true);
  };

  const remove = async (s) => {
    if (!confirm(`Excluir esta venda? O estoque dos produtos será devolvido.`)) return;
    try {
      const res = await api.delete(`/sales/${s.id}`);
      toast.success(`Venda excluída. Estoque restaurado.`);
      load();
    } catch (err) { toast.error(formatError(err)); }
  };

  const filtered = sales.filter(s => (s.customer_name || "").toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#E4002B] font-medium mb-2">Vendas</p>
          <h1 className="font-heading text-4xl font-semibold tracking-tighter">Controle de Vendas</h1>
        </div>
        <button data-testid="new-sale-btn" onClick={() => { setEditing(null); setForm({ customer_name: "", payment_method: "pix", items: [] }); setOpen(true); }} className="bg-[#E4002B] hover:bg-[#C80025] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(228,0,43,0.3)] transition-all">
          <Plus className="w-4 h-4" /> Nova Venda
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
        <input data-testid="sales-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar cliente..." className="w-full sm:max-w-sm bg-[#0a0a0a] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-white placeholder-zinc-600 focus:border-[#E4002B] outline-none" />
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0F0F0F] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/40">
            <tr className="text-left text-zinc-500 uppercase text-xs tracking-widest">
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Itens</th>
              <th className="px-5 py-3">Pagamento</th>
              <th className="px-5 py-3">Data</th>
              <th className="px-5 py-3 text-right">Total</th>
              <th className="px-5 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-zinc-500">Nenhuma venda ainda.</td></tr>
            ) : filtered.map(s => (
              <tr key={s.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-5 py-3 font-medium">{s.customer_name || "—"}</td>
                <td className="px-5 py-3 text-zinc-400">{s.items?.length || 0}</td>
                <td className="px-5 py-3"><span className="px-2 py-1 rounded-full bg-[#E4002B]/10 text-[#E4002B] text-xs uppercase tracking-wider font-bold">{PAYMENT_LABEL[s.payment_method]}</span></td>
                <td className="px-5 py-3 text-zinc-400">{new Date(s.date).toLocaleString("pt-BR")}</td>
                <td className="px-5 py-3 text-right font-heading font-semibold">R$ {Number(s.total).toFixed(2).replace(".", ",")}</td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button data-testid={`edit-sale-${s.id}`} onClick={() => startEdit(s)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/15 text-zinc-200 hover:border-white/40 hover:bg-white/5 text-xs font-medium transition-all">
                      <Pencil className="w-3.5 h-3.5" /> Editar
                    </button>
                    <button data-testid={`delete-sale-${s.id}`} onClick={() => remove(s)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#E4002B]/40 text-[#E4002B] hover:bg-[#E4002B]/10 hover:border-[#E4002B] text-xs font-medium transition-all">
                      <Trash2 className="w-3.5 h-3.5" /> Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-2xl font-semibold">{editing ? "Editar Venda" : "Nova Venda"}</h2>
              <button onClick={() => { setOpen(false); setEditing(null); }} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <input data-testid="sale-customer-input" list="customers-list" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} placeholder="Cliente" className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:border-[#E4002B] outline-none" />
              <datalist id="customers-list">{customers.map(c => <option key={c.id} value={c.name} />)}</datalist>

              {!editing && (
                <div>
                  <label className="text-xs uppercase tracking-widest text-zinc-500 block mb-2">Adicionar produto</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {products.length === 0 ? <p className="text-sm text-zinc-500 col-span-2">Cadastre produtos primeiro.</p> : products.map(p => (
                      <button key={p.id} onClick={() => addItem(p)} className="text-left p-3 rounded-lg bg-black/40 border border-white/10 hover:border-[#E4002B]/40 hover:bg-white/5 transition-all">
                        <div className="text-sm font-medium">{p.name}</div>
                        <div className="text-xs text-zinc-500">R$ {Number(p.price).toFixed(2).replace(".", ",")} · {p.stock} em estoque</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {form.items.length > 0 && (
                <div className="space-y-2">
                  {editing && <p className="text-xs text-zinc-500">Itens da venda (não editáveis — para alterar itens, exclua e crie outra venda)</p>}
                  {form.items.map(i => (
                    <div key={i.product_id} className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/10">
                      <div>
                        <div className="font-medium text-sm">{i.name}</div>
                        <div className="text-xs text-zinc-500">R$ {Number(i.price).toFixed(2).replace(".", ",")} cada</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" min={1} value={i.quantity} disabled={!!editing} onChange={(e) => setForm(f => ({ ...f, items: f.items.map(x => x.product_id === i.product_id ? { ...x, quantity: parseInt(e.target.value) || 1 } : x) }))} className="w-16 bg-black border border-white/10 rounded px-2 py-1 text-sm disabled:opacity-60" />
                        {!editing && <button onClick={() => removeItem(i.product_id)} className="text-zinc-500 hover:text-[#E4002B]"><Trash2 className="w-4 h-4" /></button>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="text-xs uppercase tracking-widest text-zinc-500 block mb-2">Pagamento</label>
                <div className="grid grid-cols-4 gap-2">
                  {["pix", "dinheiro", "credito", "debito"].map(m => (
                    <button key={m} onClick={() => setForm({ ...form, payment_method: m })} className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${form.payment_method === m ? "bg-[#E4002B] text-white border-[#E4002B]" : "border-white/10 text-zinc-300 hover:bg-white/5"}`}>{PAYMENT_LABEL[m]}</button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <div className="text-xs uppercase tracking-widest text-zinc-500">Total</div>
                  <div className="font-heading text-3xl font-bold">R$ {total.toFixed(2).replace(".", ",")}</div>
                </div>
                <button data-testid="sale-submit-btn" onClick={submit} className="bg-[#E4002B] hover:bg-[#C80025] text-white px-6 py-3 rounded-lg font-medium shadow-[0_0_15px_rgba(228,0,43,0.3)]">{editing ? "Salvar alterações" : "Registrar Venda"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

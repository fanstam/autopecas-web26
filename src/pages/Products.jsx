import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { toast } from "sonner";
import { Plus, Search, Edit2, Trash2, Loader2, Package } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", sku: "", price: "", stock: "", minStock: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (err) {
      toast.error("Erro ao carregar produtos.");
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/products", {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        minStock: parseInt(form.minStock),
      });
      toast.success("Produto cadastrado com sucesso!");
      setIsModalOpen(false);
      setForm({ name: "", sku: "", price: "", stock: "", minStock: "" });
      loadProducts();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Erro ao salvar produto.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto fade-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white tracking-tight">Produtos</h1>
          <p className="text-zinc-400 mt-1">Gerencie as peças e itens do seu catálogo.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#E4002B] hover:bg-[#C80025] text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(228,0,43,0.2)]"
        >
          <Plus className="w-4 h-4" /> Novo Produto
        </button>
      </div>

      <div className="flex items-center gap-3 bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 max-w-md">
        <Search className="w-5 h-5 text-zinc-500" />
        <input
          type="text"
          placeholder="Buscar por nome ou SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-white placeholder-zinc-600 outline-none w-full text-sm"
        />
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#E4002B]" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="border border-white/5 bg-[#0a0a0a] rounded-xl p-12 text-center text-zinc-500 flex flex-col items-center gap-3">
          <Package className="w-12 h-12 text-zinc-700" />
          <p>Nenhum produto encontrado.</p>
        </div>
      ) : (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm text-zinc-300">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-zinc-400 font-medium">
                  <th className="p-4">Item / Peça</th>
                  <th className="p-4">SKU / Código</th>
                  <th className="p-4">Preço</th>
                  <th className="p-4">Estoque</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 font-medium text-white">{product.name}</td>
                    <td className="p-4 text-zinc-500">{product.sku}</td>
                    <td className="p-4">R$ {product.price.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${product.stock <= product.minStock ? "bg-amber-500/10 text-amber-500" : "bg-zinc-800 text-zinc-400"}`}>
                        {product.stock} un.
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button className="text-zinc-400 hover:text-white p-1 transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button className="text-zinc-500 hover:text-[#E4002B] p-1 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Simplificado de Cadastro */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a0a0a] border border-white/15 rounded-xl max-w-md w-full p-6 space-y-4 fade-up">
            <h2 className="text-xl font-bold text-white">Cadastrar Novo Produto</h2>
            <form onSubmit={onSubmit} className="space-y-3">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome da Peça (ex: Pastilha de Freio Titan 160)" className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#E4002B]" />
              <input required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="Código SKU" className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#E4002B]" />
              <div className="grid grid-cols-2 gap-2">
                <input required type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Preço (R$)" className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#E4002B]" />
                <input required type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Estoque Inicial" className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#E4002B]" />
              </div>
              <input required type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} placeholder="Aviso de Estoque Mínimo" className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#E4002B]" />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">Cancelar</button>
                <button type="submit" disabled={submitting} className="bg-[#E4002B] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#C80025] transition-colors flex items-center gap-1">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

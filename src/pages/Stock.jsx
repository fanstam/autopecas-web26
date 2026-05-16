import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { toast } from "sonner";
import { ArrowUpCircle, ArrowDownCircle, Search, Loader2, History } from "lucide-react";

export default function Stock() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [movementType, setMovementType] = useState("IN"); // IN para Entrada, OUT para Saída
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (err) {
      toast.error("Erro ao carregar produtos para o estoque.");
    } finally {
      setLoading(false);
    }
  }

  const handleMovement = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !quantity) return;

    setSubmitting(true);
    try {
      await api.post(`/products/${selectedProduct.id}/stock`, {
        type: movementType,
        quantity: parseInt(quantity),
        reason: reason || (movementType === "IN" ? "Entrada manual" : "Saída manual")
      });

      toast.success(movementType === "IN" ? "Estoque adicionado!" : "Baixa realizada com sucesso!");
      setSelectedProduct(null);
      setQuantity("");
      setReason("");
      loadProducts();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Erro ao movimentar estoque.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto fade-up">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white tracking-tight">Estoque</h1>
        <p className="text-zinc-400 mt-1">Dê entrada de mercadorias ou baixa em peças de forma rápida.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna da Esquerda: Lista de Produtos */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3 bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3">
            <Search className="w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Filtrar peça por nome ou SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-white placeholder-zinc-600 outline-none w-full text-sm"
            />
          </div>

          {loading ? (
            <div className="min-h-[30vh] flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#E4002B]" />
            </div>
          ) : (
            <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden max-h-[60vh] overflow-y-auto divide-y divide-white/5">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={`p-4 flex justify-between items-center cursor-pointer transition-all ${selectedProduct?.id === product.id ? "bg-white/[0.04] border-l-4 border-l-[#E4002B]" : "hover:bg-white/[0.01]"}`}
                >
                  <div>
                    <h3 className="font-medium text-white">{product.name}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${product.stock <= product.minStock ? "bg-amber-500/10 text-amber-500" : "bg-zinc-800 text-zinc-300"}`}>
                      {product.stock} un.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coluna da Direita: Formulário de Movimentação */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 h-fit space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-zinc-400" />
            Movimentar Estoque
          </h2>

          {selectedProduct ? (
            <form onSubmit={handleMovement} className="space-y-4 pt-2">
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-lg">
                <span className="text-xs text-zinc-500 uppercase font-medium">Item Selecionado</span>
                <p className="text-sm font-medium text-white mt-0.5">{selectedProduct.name}</p>
              </div>

              {/* Seletor de Tipo */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMovementType("IN")}
                  className={`py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-1.5 transition-all ${movementType === "IN" ? "bg-emerald-500/10 border border-emerald-500 text-emerald-500" : "border border-white/5 text-zinc-500 hover:text-white"}`}
                >
                  <ArrowUpCircle className="w-4 h-4" /> Entrada
                </button>
                <button
                  type="button"
                  onClick={() => setMovementType("OUT")}
                  className={`py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-1.5 transition-all ${movementType === "OUT" ? "bg-[#E4002B]/10 border border-[#E4002B] text-[#E4002B]" : "border border-white/5 text-zinc-500 hover:text-white"}`}
                >
                  <ArrowDownCircle className="w-4 h-4" /> Baixa / Saída
                </button>
              </div>

              {/* Quantidade */}
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-medium">Quantidade</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Ex: 10"
                  className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#E4002B]"
                />
              </div>

              {/* Motivo */}
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-medium">Motivo / Justificativa</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ex: Chegada de fornecedor / Peça usada na Titan do cliente"
                  rows="3"
                  className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#E4002B] text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2 ${movementType === "IN" ? "bg-emerald-600 hover:bg-emerald-700 shadow-[0_0_15px_rgba(16,185,129,0.2)]" : "bg-[#E4002B] hover:bg-[#C80025] shadow-[0_0_15px_rgba(228,0,43,0.2)]"}`}
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirmar Lançamento"}
              </button>
            </form>
          ) : (
            <p className="text-sm text-zinc-600 text-center py-8">
              Selecione uma peça na lista para atualizar a quantidade em estoque.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { toast } from "sonner";
import { ShoppingCart, Plus, Trash2, Loader2, Search, DollarSign } from "lucide-react";

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado da venda atual
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [cart, setCart] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, custRes] = await Promise.all([
          api.get("/products"),
          api.get("/customers"),
        ]);
        setProducts(prodRes.data);
        setCustomers(custRes.data);
      } catch (err) {
        toast.error("Erro ao carregar dados de vendas.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const addToCart = (product) => {
    if (product.stock <= 0) {
      toast.warning("Produto sem estoque disponível!");
      return;
    }

    const existingIndex = cart.findIndex((item) => item.id === product.id);
    if (existingIndex > -1) {
      if (cart[existingIndex].quantity >= product.stock) {
        toast.warning("Quantidade máxima atingida de acordo com o estoque!");
        return;
      }
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast.success(`${product.name} adicionado ao carrinho.`);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, value) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (value > product.stock) {
      toast.warning(`Apenas ${product.stock} unidades disponíveis em estoque.`);
      return;
    }

    if (value <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(cart.map((item) => (item.id === productId ? { ...item, quantity: value } : item)));
  };

  const totalSale = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("O carrinho está vazio!");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/sales", {
        customerId: selectedCustomer || null,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total: totalSale,
      });

      toast.success("Venda realizada com sucesso!");
      setCart([]);
      setSelectedCustomer("");
      // Recarrega os produtos para atualizar as quantidades de estoque na tela
      const prodRes = await api.get("/products");
      setProducts(prodRes.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Erro ao finalizar venda.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchProduct.toLowerCase()) || p.sku.toLowerCase().includes(searchProduct.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#E4002B]" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto fade-up">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white tracking-tight">Frente de Caixa</h1>
        <p className="text-zinc-400 mt-1">Lence e finalize vendas de peças de moto rapidamente.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna da Esquerda: Catálogo de Itens */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3 bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3">
            <Search className="w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Pesquisar peça por nome ou código..."
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
              className="bg-transparent text-white placeholder-zinc-600 outline-none w-full text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto pr-1">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 flex flex-col justify-between hover:border-white/20 transition-all">
                <div>
                  <div className="text-xs text-zinc-500 font-medium">SKU: {product.sku}</div>
                  <h3 className="font-semibold text-white mt-0.5 text-base">{product.name}</h3>
                  <div className="text-[#E4002B] font-bold text-lg mt-2">R$ {product.price.toFixed(2)}</div>
                </div>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
                  <span className={`text-xs ${product.stock <= 0 ? "text-red-500" : "text-zinc-400"}`}>
                    {product.stock <= 0 ? "Sem estoque" : `${product.stock} un. disponíveis`}
                  </span>
                  <button
                    disabled={product.stock <= 0}
                    onClick={() => addToCart(product)}
                    className="p-2 rounded-lg bg-white/5 text-white hover:bg-[#E4002B] disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna da Direita: Carrinho / Checkout */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 h-fit flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <ShoppingCart className="w-5 h-5 text-[#E4002B]" />
              Carrinho de Compras
            </h2>

            {/* Selecionar Cliente (Opcional) */}
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">Vincular Cliente (Opcional)</label>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#E4002B] text-sm"
              >
                <option value="">Consumidor Geral (Não identificado)</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Listagem do Carrinho */}
            <div className="space-y-3 max-h-[35vh] overflow-y-auto divide-y divide-white/5 pr-1">
              {cart.length === 0 ? (
                <p className="text-sm text-zinc-600 text-center py-12">O carrinho está vazio.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="pt-3 flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-zinc-500 mt-0.5">R$ {item.price.toFixed(2)} / un.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                        className="w-12 bg-[#111] border border-white/10 rounded px-1.5 py-0.5 text-center text-white text-sm outline-none"
                      />
                      <button onClick={() => removeFromCart(item.id)} className="text-zinc-500 hover:text-red-500 transition-colors p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Resumo e Fechamento */}
          <div className="border-t border-white/10 pt-4 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-zinc-400">Valor Total:</span>
              <span className="text-2xl font-black text-white">R$ {totalSale.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={submitting || cart.length === 0}
              className="w-full bg-[#E4002B] hover:bg-[#C80025] disabled:opacity-40 disabled:hover:bg-[#E4002B] text-white font-semibold py-3 rounded-lg shadow-[0_0_20px_rgba(228,0,43,0.25)] transition-all flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Finalizar e Receber <DollarSign className="w-4 h-4" /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

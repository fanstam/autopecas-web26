import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { toast } from "sonner";
import { Plus, Loader2, ArrowUpRight, ArrowDownRight, DollarSign, Calendar, TrendingUp } from "lucide-react";

export default function Financial() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    description: "",
    type: "INCOME", // INCOME para Entrada, EXPENSE para Saída
    amount: "",
    category: ""
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      const response = await api.get("/financial");
      setTransactions(response.data);
    } catch (err) {
      toast.error("Erro ao carregar o fluxo de caixa.");
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/financial", {
        ...form,
        amount: parseFloat(form.amount)
      });
      toast.success("Lançamento financeiro registrado!");
      setIsModalOpen(false);
      setForm({ description: "", type: "INCOME", amount: "", category: "" });
      loadTransactions();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Erro ao salvar lançamento.");
    } finally {
      setSubmitting(false);
    }
  };

  // Cálculos do Painel Financeiro
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto fade-up">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white tracking-tight">Fluxo de Caixa</h1>
          <p className="text-zinc-400 mt-1">Monitore as receitas e despesas da sua empresa.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#E4002B] hover:bg-[#C80025] text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(228,0,43,0.2)]"
        >
          <Plus className="w-4 h-4" /> Novo Lançamento
        </button>
      </div>

      {/* Cards de Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-zinc-400 text-sm font-medium">Total de Entradas</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><ArrowUpRight className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-bold text-white">R$ {totalIncome.toFixed(2)}</div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-zinc-400 text-sm font-medium">Total de Saídas</span>
            <div className="p-2 rounded-lg bg-[#E4002B]/10 text-[#E4002B]"><ArrowDownRight className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-bold text-white">R$ {totalExpense.toFixed(2)}</div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-zinc-400 text-sm font-medium">Saldo Atual</span>
            <div className={`p-2 rounded-lg bg-white/5 ${balance >= 0 ? "text-emerald-500" : "text-red-500"}`}><DollarSign className="w-4 h-4" /></div>
          </div>
          <div className={`text-2xl font-black ${balance >= 0 ? "text-emerald-400" : "text-red-500"}`}>R$ {balance.toFixed(2)}</div>
        </div>
      </div>

      {/* Tabela de Extrato */}
      {loading ? (
        <div className="min-h-[30vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#E4002B]" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="border border-white/5 bg-[#0a0a0a] rounded-xl p-12 text-center text-zinc-500 flex flex-col items-center gap-3">
          <DollarSign className="w-12 h-12 text-zinc-700" />
          <p>Nenhuma movimentação financeira lançada neste período.</p>
        </div>
      ) : (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm text-zinc-300">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-zinc-400 font-medium">
                  <th className="p-4">Data</th>
                  <th className="p-4">Descrição</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 text-zinc-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(t.createdAt).toLocaleDateString("pt-BR")}</td>
                    <td className="p-4 font-medium text-white">{t.description}</td>
                    <td className="p-4 text-zinc-400"><span className="bg-white/5 border border-white/5 px-2 py-0.5 rounded text-xs">{t.category || "Geral"}</span></td>
                    <td className={`p-4 text-right font-semibold ${t.type === "INCOME" ? "text-emerald-400" : "text-[#E4002B]"}`}>
                      {t.type === "INCOME" ? "+" : "-"} R$ {t.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Lançamento */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a0a0a] border border-white/15 rounded-xl max-w-md w-full p-6 space-y-4 fade-up">
            <h2 className="text-xl font-bold text-white">Novo Lançamento Caixa</h2>
            <form onSubmit={onSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: "INCOME" })}
                  className={`py-2 rounded-lg font-medium text-sm transition-all ${form.type === "INCOME" ? "bg-emerald-500/10 border border-emerald-500 text-emerald-500" : "border border-white/5 text-zinc-500"}`}
                >
                  Receita (+)
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: "EXPENSE" })}
                  className={`py-2 rounded-lg font-medium text-sm transition-all ${form.type === "EXPENSE" ? "bg-[#E4002B]/10 border border-[#E4002B] text-[#E4002B]" : "border border-white/5 text-zinc-500"}`}
                >
                  Despesa (-)
                </button>
              </div>

              <input required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descrição (ex: Compra de Óleo Mobil, Conta de Luz)" className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#E4002B] text-sm" />
              <input required type="number" step="0.01" min="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Valor (R$)" className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#E4002B] text-sm" />
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Categoria (ex: Peças, Fornecedores, Infraestrutura)" className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#E4002B] text-sm" />

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">Cancelar</button>
                <button type="submit" disabled={submitting} className="bg-[#E4002B] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#C80025] transition-colors flex items-center gap-1">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar Lançamento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

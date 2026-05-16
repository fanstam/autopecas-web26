import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { toast } from "sonner";
import { Plus, Search, Edit2, Trash2, Loader2, Users, UserPlus } from "lucide-react";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", document: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const response = await api.get("/customers");
      setCustomers(response.data);
    } catch (err) {
      toast.error("Erro ao carregar lista de clientes.");
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/customers", form);
      toast.success("Cliente cadastrado com sucesso!");
      setIsModalOpen(false);
      setForm({ name: "", email: "", phone: "", document: "" });
      loadCustomers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Erro ao salvar cliente.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.document && c.document.includes(search)) ||
    (c.phone && c.phone.includes(search))
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto fade-up">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white tracking-tight">Clientes</h1>
          <p className="text-zinc-400 mt-1">Gerencie a base de clientes do seu sistema.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#E4002B] hover:bg-[#C80025] text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(228,0,43,0.2)]"
        >
          <UserPlus className="w-4 h-4" /> Novo Cliente
        </button>
      </div>

      {/* Filtro de Busca */}
      <div className="flex items-center gap-3 bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 max-w-md">
        <Search className="w-5 h-5 text-zinc-500" />
        <input
          type="text"
          placeholder="Buscar por nome, CPF ou telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-white placeholder-zinc-600 outline-none w-full text-sm"
        />
      </div>

      {/* Conteúdo Principal */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#E4002B]" />
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="border border-white/5 bg-[#0a0a0a] rounded-xl p-12 text-center text-zinc-500 flex flex-col items-center gap-3">
          <Users className="w-12 h-12 text-zinc-700" />
          <p>Nenhum cliente cadastrado ou encontrado.</p>
        </div>
      ) : (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm text-zinc-300">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-zinc-400 font-medium">
                  <th className="p-4">Nome Completo</th>
                  <th className="p-4">Telefone / WhatsApp</th>
                  <th className="p-4">E-mail</th>
                  <th className="p-4">CPF / CNPJ</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 font-medium text-white">{customer.name}</td>
                    <td className="p-4 text-zinc-400">{customer.phone || "Não informado"}</td>
                    <td className="p-4 text-zinc-400">{customer.email || "Não informado"}</td>
                    <td className="p-4 text-zinc-500">{customer.document || "---"}</td>
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

      {/* Modal Cadastro de Clientes */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a0a0a] border border-white/15 rounded-xl max-w-md w-full p-6 space-y-4 fade-up">
            <h2 className="text-xl font-bold text-white">Cadastrar Novo Cliente</h2>
            <form onSubmit={onSubmit} className="space-y-3">
              <div className="space-y-1">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome Completo *" className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#E4002B]" />
              </div>
              <div className="space-y-1">
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="E-mail (Opcional)" className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#E4002B]" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Telefone / WhatsApp *" className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#E4002B]" />
                <input value={form.document} onChange={(e) => setForm({ ...form, document: e.target.value })} placeholder="CPF (Opcional)" className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#E4002B]" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">Cancelar</button>
                <button type="submit" disabled={submitting} className="bg-[#E4002B] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#C80025] transition-colors flex items-center gap-1">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar Cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

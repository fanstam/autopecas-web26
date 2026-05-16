import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { toast } from "sonner";
import { Plus, Search, Calendar, Clock, Loader2, Wrench, CheckCircle } from "lucide-react";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    customerId: "",
    date: "",
    time: "",
    services: "",
    notes: ""
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [appRes, custRes] = await Promise.all([
          api.get("/appointments"),
          api.get("/customers")
        ]);
        setAppointments(appRes.data);
        setCustomers(custRes.data);
      } catch (err) {
        toast.error("Erro ao carregar os agendamentos da oficina.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/appointments", form);
      toast.success("Agendamento realizado com sucesso!");
      setIsModalOpen(false);
      setForm({ customerId: "", date: "", time: "", services: "", notes: "" });
      
      // Recarregar lista
      const response = await api.get("/appointments");
      setAppointments(response.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Erro ao criar agendamento.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await api.patch(`/appointments/${id}/complete`);
      toast.success("Serviço concluído e marcado como finalizado!");
      const response = await api.get("/appointments");
      setAppointments(response.data);
    } catch (err) {
      toast.error("Erro ao atualizar status do agendamento.");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto fade-up">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white tracking-tight">Oficina & Agendamentos</h1>
          <p className="text-zinc-400 mt-1">Controle os serviços, revisões e horários das motos Honda.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#E4002B] hover:bg-[#C80025] text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(228,0,43,0.2)]"
        >
          <Plus className="w-4 h-4" /> Novo Agendamento
        </button>
      </div>

      {/* Grid de Agendamentos */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#E4002B]" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="border border-white/5 bg-[#0a0a0a] rounded-xl p-12 text-center text-zinc-500 flex flex-col items-center gap-3">
          <Calendar className="w-12 h-12 text-zinc-700" />
          <p>Nenhum agendamento marcado para os próximos dias.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments.map((app) => (
            <div 
              key={app.id} 
              className={`bg-[#0a0a0a] border ${app.status === "COMPLETED" ? "border-emerald-500/20 opacity-70" : "border-white/10"} rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${app.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400" : "bg-[#E4002B]/10 text-[#E4002B]"}`}>
                    {app.status === "COMPLETED" ? "Finalizado" : "Pendente"}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-zinc-500 font-medium">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(app.date).toLocaleDateString("pt-BR")}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {app.time}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base">{app.customer?.name || "Cliente não identificado"}</h3>
                  <p className="text-xs text-zinc-500">{app.customer?.phone || "Sem telefone de contato"}</p>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-3 rounded-lg text-sm text-zinc-300">
                  <div className="flex items-start gap-1.5 font-medium text-white mb-1 text-xs uppercase tracking-wider text-zinc-400">
                    <Wrench className="w-3.5 h-3.5 text-[#E4002B]" /> Serviços Solicitados
                  </div>
                  <p className="line-clamp-2 text-zinc-400">{app.services}</p>
                </div>
              </div>

              {app.status !== "COMPLETED" && (
                <button
                  onClick={() => handleComplete(app.id)}
                  className="w-full bg-zinc-900 hover:bg-emerald-600 border border-white/5 text-zinc-300 hover:text-white py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Concluir Serviço
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal Cadastro de Agendamento */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a0a0a] border border-white/15 rounded-xl max-w-md w-full p-6 space-y-4 fade-up">
            <h2 className="text-xl font-bold text-white">Agendar Serviço na Oficina</h2>
            <form onSubmit={onSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-medium">Selecione o Cliente *</label>
                <select
                  required
                  value={form.customerId}
                  onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                  className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2.5 text-white outline-none focus:border-[#E4002B] text-sm"
                >
                  <option value="">-- Escolha o dono da moto --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium">Data *</label>
                  <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-[#E4002B] text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium">Horário *</label>
                  <input required type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-[#E4002B] text-sm" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-medium">Defeito / Serviços a fazer *</label>
                <textarea required rows="3" value={form.services} onChange={(e) => setForm({ ...form, services: e.target.value })} placeholder="Ex: Troca de óleo, regulagem de válvulas e substituição da lona de freio traseira." className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#E4002B] text-sm resize-none" />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">Cancelar</button>
                <button type="submit" disabled={submitting} className="bg-[#E4002B] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#C80025] transition-colors flex items-center gap-1">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Agendar Horário"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

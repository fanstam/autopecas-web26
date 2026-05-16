import { useEffect, useState, useMemo } from "react";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";
import { Plus, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";

const SERVICES = {
  troca_oleo: "Troca de óleo",
  revisao: "Revisão",
  instalacao_pecas: "Instalação de peças",
  troca_pneu: "Troca de pneu",
  consorcio: "Atendimento consórcio",
};
const STATUS_STYLE = {
  confirmado: "bg-green-500/15 text-green-400 border-green-500/30",
  pendente: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  cancelado: "bg-red-500/15 text-red-400 border-red-500/30",
};
const HOURS = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
const DAYS_LABEL = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const empty = { customer_name: "", motorcycle_model: "", service: "revisao", date: "", time: "09:00", status: "pendente", notes: "" };

function startOfWeek(d) { const x = new Date(d); x.setDate(x.getDate() - x.getDay()); x.setHours(0,0,0,0); return x; }

export default function Appointments() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));

  const load = async () => setItems((await api.get("/appointments")).data);
  useEffect(() => { load(); }, []);

  const week = useMemo(() => Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart); d.setDate(d.getDate() + i); return d; }), [weekStart]);

  const itemAt = (date, time) => items.find(a => a.date === date.toISOString().slice(0,10) && a.time === time);

  const newAt = (date, time) => {
    setForm({ ...empty, date: date.toISOString().slice(0,10), time });
    setOpen(true);
  };

  const save = async () => {
    if (!form.customer_name || !form.date) return toast.error("Preencha cliente e data");
    try { await api.post("/appointments", form); toast.success("Agendamento criado!"); setOpen(false); load(); }
    catch (err) { toast.error(formatError(err)); }
  };

  const remove = async (id) => { if (!confirm("Cancelar agendamento?")) return; await api.delete(`/appointments/${id}`); load(); };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#E4002B] font-medium mb-2">Agenda Semanal</p>
          <h1 className="font-heading text-4xl font-semibold tracking-tighter">Agendamentos</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { const x = new Date(weekStart); x.setDate(x.getDate() - 7); setWeekStart(x); }} className="p-2 rounded-lg border border-white/10 hover:bg-white/5"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-sm text-zinc-400">{weekStart.toLocaleDateString("pt-BR")} → {new Date(weekStart.getTime() + 6*86400000).toLocaleDateString("pt-BR")}</span>
          <button onClick={() => { const x = new Date(weekStart); x.setDate(x.getDate() + 7); setWeekStart(x); }} className="p-2 rounded-lg border border-white/10 hover:bg-white/5"><ChevronRight className="w-4 h-4" /></button>
          <button data-testid="new-appointment-btn" onClick={() => { setForm({ ...empty, date: new Date().toISOString().slice(0,10) }); setOpen(true); }} className="ml-2 bg-[#E4002B] hover:bg-[#C80025] text-white px-5 py-2 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(228,0,43,0.3)]">
            <Plus className="w-4 h-4" /> Novo
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0F0F0F] overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-black/40">
            <tr>
              <th className="px-3 py-3 text-left text-xs uppercase tracking-widest text-zinc-500 w-20">Hora</th>
              {week.map((d, i) => (
                <th key={i} className="px-3 py-3 text-left text-xs uppercase tracking-widest text-zinc-500">
                  <div className="text-zinc-300 font-bold">{DAYS_LABEL[d.getDay()]}</div>
                  <div className="text-zinc-500 text-[10px] mt-1">{d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map(h => (
              <tr key={h} className="border-t border-white/5">
                <td className="px-3 py-2 text-xs text-zinc-500 font-mono">{h}</td>
                {week.map((d, i) => {
                  const a = itemAt(d, h);
                  return (
                    <td key={i} className="px-2 py-2 align-top">
                      {a ? (
                        <div className={`rounded-lg p-2 border ${STATUS_STYLE[a.status]} text-xs group relative`}>
                          <div className="font-medium truncate">{a.customer_name}</div>
                          <div className="text-[10px] opacity-80 truncate">{SERVICES[a.service]}</div>
                          <div className="text-[10px] opacity-60 truncate">{a.motorcycle_model}</div>
                          <button onClick={() => remove(a.id)} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      ) : (
                        <button onClick={() => newAt(d, h)} className="w-full h-full min-h-[44px] rounded-lg border border-dashed border-white/10 hover:border-[#E4002B]/40 hover:bg-white/5 transition-all text-zinc-700 text-xs">+</button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-2xl font-semibold">Novo Agendamento</h2>
              <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input data-testid="appt-customer-input" placeholder="Nome do cliente" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 focus:border-[#E4002B] outline-none" />
              <input placeholder="Modelo da moto" value={form.motorcycle_model} onChange={(e) => setForm({ ...form, motorcycle_model: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 focus:border-[#E4002B] outline-none" />
              <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 focus:border-[#E4002B] outline-none">
                {Object.entries(SERVICES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 focus:border-[#E4002B] outline-none" />
                <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 focus:border-[#E4002B] outline-none">
                  {HOURS.map(h => <option key={h}>{h}</option>)}
                </select>
              </div>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 focus:border-[#E4002B] outline-none">
                <option value="pendente">Pendente</option>
                <option value="confirmado">Confirmado</option>
                <option value="cancelado">Cancelado</option>
              </select>
              <button data-testid="appt-save-btn" onClick={save} className="w-full bg-[#E4002B] hover:bg-[#C80025] text-white py-3 rounded-lg font-medium">Agendar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

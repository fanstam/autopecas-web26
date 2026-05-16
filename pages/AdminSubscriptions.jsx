import { useEffect, useState } from "react";
import { api, formatError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Plus, Check, Ban, X, Calendar as CalendarIcon, Crown, Trash2 } from "lucide-react";
import { Navigate } from "react-router-dom";

const empty = { name: "", email: "", phone: "", password: "", days: 30 };

const Badge = ({ status }) => {
  const styles = {
    active: "bg-green-500/15 text-green-400 border-green-500/30",
    expired: "bg-red-500/15 text-red-400 border-red-500/30",
    blocked: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
    pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  };
  const labels = { active: "Ativo", expired: "Expirado", blocked: "Bloqueado", pending: "Em análise" };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${styles[status]}`}>{labels[status]}</span>;
};

export default function AdminSubscriptions() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const load = async () => setUsers((await api.get("/admin/users")).data);
  useEffect(() => { if (user?.role === "admin") load(); }, [user]);

  if (user && user.role !== "admin") return <Navigate to="/dashboard" replace />;

  const create = async () => {
    try { await api.post("/admin/users", form); toast.success("Usuário criado!"); setOpen(false); setForm(empty); load(); }
    catch (err) { toast.error(formatError(err)); }
  };

  const toggleBlock = async (u) => { await api.patch(`/admin/users/${u.id}`, { blocked: !u.blocked }); toast.success(u.blocked ? "Desbloqueado" : "Bloqueado"); load(); };
  const approve = async (u) => { await api.post(`/admin/renewals/${u.id}/approve`); toast.success("Renovação aprovada (+30 dias)"); load(); };
  const extend = async (u, days) => { await api.patch(`/admin/users/${u.id}`, { extend_days: days }); toast.success(`+${days} dias`); load(); };
  const remove = async (u) => { if (!confirm(`Excluir ${u.name}?`)) return; await api.delete(`/admin/users/${u.id}`); load(); };

  const pending = users.filter(u => u.status === "pending");

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#E4002B] font-medium mb-2 flex items-center gap-2"><Crown className="w-3 h-3" /> Painel Administrador</p>
          <h1 className="font-heading text-4xl font-semibold tracking-tighter">Assinaturas</h1>
        </div>
        <button data-testid="admin-new-user-btn" onClick={() => { setForm(empty); setOpen(true); }} className="bg-[#E4002B] hover:bg-[#C80025] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(228,0,43,0.3)]">
          <Plus className="w-4 h-4" /> Criar Usuário
        </button>
      </div>

      {pending.length > 0 && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4">
          <p className="text-yellow-400 font-medium mb-3">{pending.length} pagamento(s) em análise — aguardando aprovação</p>
          <div className="flex flex-wrap gap-2">
            {pending.map(u => (
              <button key={u.id} onClick={() => approve(u)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Aprovar {u.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-white/10 bg-[#0F0F0F] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/40 text-left text-zinc-500 uppercase text-xs tracking-widest">
            <tr>
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Vencimento</th>
              <th className="px-5 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-5 py-3">
                  <div className="font-medium">{u.name} {u.role === "admin" && <span className="ml-1 text-[10px] uppercase tracking-widest text-[#E4002B]">admin</span>}</div>
                  <div className="text-xs text-zinc-500">{u.email}</div>
                </td>
                <td className="px-5 py-3"><Badge status={u.status} /></td>
                <td className="px-5 py-3 text-zinc-400">{u.subscription_expiry ? new Date(u.subscription_expiry).toLocaleDateString("pt-BR") : "—"}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2 flex-wrap">
                    {u.status === "pending" && (
                      <button data-testid={`approve-${u.id}`} onClick={() => approve(u)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Aprovar</button>
                    )}
                    {u.role !== "admin" && (
                      <>
                        <button onClick={() => extend(u, 30)} className="border border-white/10 hover:border-[#E4002B] hover:bg-white/5 text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> +30 dias</button>
                        <button data-testid={`block-${u.id}`} onClick={() => toggleBlock(u)} className="border border-white/10 hover:border-[#E4002B] hover:bg-white/5 text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1"><Ban className="w-3 h-3" /> {u.blocked ? "Liberar" : "Bloquear"}</button>
                        <button onClick={() => remove(u)} className="text-zinc-500 hover:text-[#E4002B] p-1.5"><Trash2 className="w-3.5 h-3.5" /></button>
                      </>
                    )}
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
              <h2 className="font-heading text-2xl font-semibold">Criar Usuário</h2>
              <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input data-testid="adm-user-name" placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 focus:border-[#E4002B] outline-none" />
              <input data-testid="adm-user-email" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 focus:border-[#E4002B] outline-none" />
              <input placeholder="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 focus:border-[#E4002B] outline-none" />
              <input data-testid="adm-user-password" type="password" placeholder="Senha temporária" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 focus:border-[#E4002B] outline-none" />
              <input type="number" placeholder="Dias de assinatura" value={form.days} onChange={(e) => setForm({ ...form, days: parseInt(e.target.value) || 30 })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 focus:border-[#E4002B] outline-none" />
              <button data-testid="adm-user-create-btn" onClick={create} className="w-full bg-[#E4002B] hover:bg-[#C80025] text-white py-3 rounded-lg font-medium">Criar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

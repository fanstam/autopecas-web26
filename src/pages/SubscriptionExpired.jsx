import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, formatError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Copy, MessageCircle, CheckCircle2, AlertTriangle, LogOut, Loader2 } from "lucide-react";

export default function SubscriptionExpired() {
  const navigate = useNavigate();
  const { user, logout, refresh } = useAuth();
  const [info, setInfo] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user === null) { navigate("/login"); return; }
    if (user && user.status === "active") { navigate("/dashboard"); return; }
    if (user) api.get("/subscription/info").then(r => setInfo(r.data)).catch(() => {});
  }, [user, navigate]);

  const copyPix = async () => {
    try {
      await navigator.clipboard.writeText(info?.pix_key || "");
      toast.success("Chave Pix copiada");
    } catch { toast.error("Não foi possível copiar"); }
  };

  const requestRenewal = async () => {
    setSubmitting(true);
    try {
      await api.post("/subscription/request-renewal");
      toast.success("Solicitação enviada! Aguardando aprovação.");
      await refresh();
    } catch (err) { toast.error(formatError(err)); }
    finally { setSubmitting(false); }
  };

  const expiryStr = info?.user?.subscription_expiry ? new Date(info.user.subscription_expiry).toLocaleDateString("pt-BR") : "—";
  const pending = user?.status === "pending" || user?.renewal_pending;
  const blocked = user?.blocked;

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden flex items-center justify-center p-6">
      <div
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1643142314913-0cf633d9bbb5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjBkZWFsZXJzaGlwJTIwaW50ZXJpb3J8ZW58MHx8fHwxNzc4NzIwMjg2fDA&ixlib=rb-4.1.0&q=85')", backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/90 to-black/95" />
      <div className="absolute inset-0 red-ambient" />

      <div className="relative max-w-2xl w-full fade-up">
        <div className="glass rounded-2xl p-8 sm:p-10 border border-white/10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#E4002B] flex items-center justify-center honda-glow">
                <span className="font-heading font-bold text-white text-2xl">H</span>
              </div>
              <div>
                <div className="font-heading font-bold text-white leading-none">Auto Peças</div>
                <div className="text-xs tracking-[0.3em] text-[#E4002B] font-medium uppercase mt-1">Honda</div>
              </div>
            </div>
            <button onClick={logout} data-testid="expired-logout-btn" className="text-zinc-500 hover:text-white text-sm flex items-center gap-1.5"><LogOut className="w-4 h-4" /> Sair</button>
          </div>

          {pending ? (
            <div className="text-center py-4 mb-6 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <p className="text-yellow-400 font-medium" data-testid="status-pending">Pagamento em análise</p>
              <p className="text-zinc-400 text-sm mt-1">O administrador será notificado e aprovará em breve.</p>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-5 h-5 text-[#E4002B]" />
              <span className="text-[#E4002B] uppercase tracking-widest text-sm font-bold">{blocked ? "Conta bloqueada" : "Acesso bloqueado"}</span>
            </div>
          )}

          <h1 data-testid="expired-title" className="font-heading text-4xl sm:text-5xl font-semibold tracking-tighter text-white mb-3">Sua assinatura expirou.</h1>
          <p className="text-zinc-400 mb-8">Realize o pagamento da assinatura para liberar novamente seu acesso.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="rounded-lg border border-white/10 bg-black/40 p-5">
              <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Valor do plano</div>
              <div className="font-heading text-3xl font-bold text-white">R$ {(info?.plan_price ?? 30).toFixed(2).replace(".", ",")}<span className="text-base text-zinc-500 font-normal">/mês</span></div>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/40 p-5">
              <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Vencimento</div>
              <div className="font-heading text-3xl font-bold text-white" data-testid="expired-date">{expiryStr}</div>
            </div>
          </div>

          <div className="rounded-lg border border-[#E4002B]/30 bg-[#E4002B]/5 p-5 mb-6">
            <div className="text-xs uppercase tracking-widest text-zinc-400 mb-2">Pague via Pix — Chave</div>
            <div className="flex items-center justify-between gap-3">
              <span data-testid="pix-key" className="font-heading text-2xl font-semibold text-white tracking-wide">{info?.pix_key || "92 99516-2483"}</span>
              <button data-testid="copy-pix-btn" onClick={copyPix} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 hover:border-[#E4002B] hover:bg-white/5 text-sm transition-all">
                <Copy className="w-4 h-4" /> Copiar
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              data-testid="already-paid-btn"
              disabled={submitting || pending}
              onClick={requestRenewal}
              className="flex-1 bg-[#E4002B] hover:bg-[#C80025] disabled:opacity-60 text-white font-medium px-6 py-3.5 rounded-lg shadow-[0_0_18px_rgba(228,0,43,0.35)] transition-all flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Já realizei o pagamento</>}
            </button>
            <a
              data-testid="whatsapp-btn"
              href={`https://wa.me/${info?.whatsapp || "5592995162483"}?text=${encodeURIComponent("Olá! Quero renovar minha assinatura do Auto Peças Honda.")}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium px-6 py-3.5 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" /> Renovar via WhatsApp
            </a>
          </div>

          <p className="text-xs text-zinc-600 text-center mt-8">Após confirmação, seu acesso será liberado automaticamente.</p>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">Desenvolvido por <span className="text-zinc-400">Mateus Oliveira</span></p>
      </div>
    </div>
  );
}

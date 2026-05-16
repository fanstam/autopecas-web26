import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { formatError } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Conta criada! 7 dias de teste gratuitos.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(formatError(err));
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 relative">
      <div className="absolute inset-0 red-ambient pointer-events-none" />
      <div className="relative w-full max-w-md fade-up">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#E4002B] flex items-center justify-center honda-glow">
            <span className="font-heading font-bold text-white text-2xl">H</span>
          </div>
          <div>
            <div className="font-heading font-bold text-white text-xl leading-none">Auto Peças</div>
            <div className="text-xs tracking-[0.3em] text-[#E4002B] font-medium uppercase mt-1">Honda</div>
          </div>
        </div>

        <h1 className="font-heading text-4xl font-semibold tracking-tighter text-white mb-2">Crie sua conta.</h1>
        <p className="text-zinc-400 mb-8">7 dias de teste gratuitos. Sem cartão.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <input data-testid="register-name-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome completo" className="w-full bg-[#0a0a0a] border border-white/15 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-[#E4002B] focus:ring-1 focus:ring-[#E4002B] outline-none" />
          <input data-testid="register-email-input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full bg-[#0a0a0a] border border-white/15 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-[#E4002B] focus:ring-1 focus:ring-[#E4002B] outline-none" />
          <input data-testid="register-phone-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Telefone (WhatsApp)" className="w-full bg-[#0a0a0a] border border-white/15 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-[#E4002B] focus:ring-1 focus:ring-[#E4002B] outline-none" />
          <input data-testid="register-password-input" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Senha (mín. 6 caracteres)" className="w-full bg-[#0a0a0a] border border-white/15 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-[#E4002B] focus:ring-1 focus:ring-[#E4002B] outline-none" />
          <button
            data-testid="register-submit-button"
            type="submit"
            disabled={loading}
            className="w-full bg-[#E4002B] hover:bg-[#C80025] disabled:opacity-60 text-white font-medium px-6 py-3.5 rounded-lg shadow-[0_0_18px_rgba(228,0,43,0.35)] transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Criar conta <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
          </button>
        </form>

        <p className="text-sm text-zinc-500 mt-8">
          Já tem conta?{" "}
          <Link to="/login" data-testid="goto-login" className="text-[#E4002B] hover:underline font-medium">Entrar</Link>
        </p>
      </div>
    </div>
  );
}

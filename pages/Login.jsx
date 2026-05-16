import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { formatError } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(form.email, form.password);
      if (u.status === "expired" || u.blocked) navigate("/subscription-expired");
      else navigate("/dashboard");
      toast.success(`Bem-vindo, ${u.name.split(" ")[0]}`);
    } catch (err) {
      toast.error(formatError(err));
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-[#050505]">
      {/* Left form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute inset-0 red-ambient pointer-events-none" />
        <div className="relative w-full max-w-md fade-up">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-xl bg-[#E4002B] flex items-center justify-center honda-glow">
              <span className="font-heading font-bold text-white text-2xl">H</span>
            </div>
            <div>
              <div className="font-heading font-bold text-white text-xl leading-none">Auto Peças</div>
              <div className="text-xs tracking-[0.3em] text-[#E4002B] font-medium uppercase mt-1">Honda</div>
            </div>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl font-semibold tracking-tighter text-white mb-2">Acesse seu painel.</h1>
          <p className="text-zinc-400 mb-10">Sistema premium de gestão para concessionárias Honda.</p>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium block mb-2">Email</label>
              <input
                data-testid="login-email-input"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="seu@email.com"
                className="w-full bg-[#0a0a0a] border border-white/15 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-[#E4002B] focus:ring-1 focus:ring-[#E4002B] outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium block mb-2">Senha</label>
              <input
                data-testid="login-password-input"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-[#0a0a0a] border border-white/15 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-[#E4002B] focus:ring-1 focus:ring-[#E4002B] outline-none transition-all"
              />
            </div>
            <button
              data-testid="login-submit-button"
              type="submit"
              disabled={loading}
              className="w-full bg-[#E4002B] hover:bg-[#C80025] disabled:opacity-60 text-white font-medium px-6 py-3.5 rounded-lg shadow-[0_0_18px_rgba(228,0,43,0.35)] hover:shadow-[0_0_28px_rgba(228,0,43,0.55)] transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Entrar <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></>}
            </button>
          </form>

          <p className="text-sm text-zinc-500 mt-8">
            Não tem conta?{" "}
            <Link to="/register" data-testid="goto-register" className="text-[#E4002B] hover:underline font-medium">Crie sua conta</Link>
          </p>

          <div className="mt-12 pt-6 border-t border-white/10">
            <p className="text-xs text-zinc-500">Desenvolvido por <span className="text-white">Mateus Oliveira</span></p>
          </div>
        </div>
      </div>

      {/* Right image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1653058489330-b6ede759022e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxNzV8MHwxfHNlYXJjaHwzfHxob25kYSUyMG1vdG9yY3ljbGUlMjBzdHVkaW8lMjBzaG90JTIwZGFya3xlbnwwfHx8fDE3Nzg3MjAyODZ8MA&ixlib=rb-4.1.0&q=85"
          alt="Honda"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/30 to-[#050505]" />
        <div className="absolute bottom-12 left-12 right-12 z-10">
          <h2 className="font-heading text-5xl font-light text-white leading-tight tracking-tight">Performance.<br /><span className="font-bold text-[#E4002B]">Precisão.</span> Premium.</h2>
          <p className="text-zinc-300 mt-4 max-w-md">Tudo o que sua concessionária Honda precisa em um único painel.</p>
        </div>
      </div>
    </div>
  );
}

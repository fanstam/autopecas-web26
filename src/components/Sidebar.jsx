import { NavLink } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Package, Boxes, Users, CalendarDays, Wallet, FileBarChart, Crown, Settings as SettingsIcon, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, testid: "nav-dashboard" },
  { to: "/sales", label: "Vendas", icon: ShoppingCart, testid: "nav-sales" },
  { to: "/products", label: "Produtos", icon: Package, testid: "nav-products" },
  { to: "/stock", label: "Estoque", icon: Boxes, testid: "nav-stock" },
  { to: "/customers", label: "Clientes", icon: Users, testid: "nav-customers" },
  { to: "/appointments", label: "Agendamentos", icon: CalendarDays, testid: "nav-appointments" },
  { to: "/financial", label: "Financeiro", icon: Wallet, testid: "nav-financial" },
  { to: "/reports", label: "Relatórios", icon: FileBarChart, testid: "nav-reports" },
];

export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <aside className="w-[260px] shrink-0 h-screen bg-[#050505] border-r border-white/10 flex flex-col sticky top-0">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#E4002B] flex items-center justify-center honda-glow">
            <span className="font-heading font-bold text-white text-lg">H</span>
          </div>
          <div>
            <div className="font-heading font-bold text-white leading-tight">Auto Peças</div>
            <div className="text-xs tracking-widest text-[#E4002B] font-medium uppercase">Honda</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map(({ to, label, icon: Icon, testid }) => (
          <NavLink
            key={to}
            to={to}
            data-testid={testid}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#E4002B] text-white shadow-[0_0_15px_rgba(228,0,43,0.3)]"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
            {label}
          </NavLink>
        ))}
        {isAdmin && (
          <NavLink
            to="/admin/subscriptions"
            data-testid="nav-subscriptions"
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#E4002B] text-white shadow-[0_0_15px_rgba(228,0,43,0.3)]"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Crown className="w-[18px] h-[18px]" strokeWidth={1.5} />
            Assinaturas
          </NavLink>
        )}
        <NavLink
          to="/settings"
          data-testid="nav-settings"
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive ? "bg-[#E4002B] text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`
          }
        >
          <SettingsIcon className="w-[18px] h-[18px]" strokeWidth={1.5} />
          Configurações
        </NavLink>
      </nav>
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E4002B] to-[#7a0017] flex items-center justify-center text-white font-heading font-bold text-sm">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{user?.name}</div>
            <div className="text-xs text-zinc-500 truncate">{user?.email}</div>
          </div>
        </div>
        <button
          data-testid="logout-button"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white border border-white/10 hover:border-[#E4002B]/50 hover:bg-white/5 transition-all"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.5} /> Sair
        </button>
      </div>
    </aside>
  );
}

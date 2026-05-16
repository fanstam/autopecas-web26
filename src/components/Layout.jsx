import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Menu, X } from "lucide-react";

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="relative z-10">
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-40 glass border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <button
            data-testid="mobile-menu-btn"
            onClick={() => setOpen(true)}
            className="p-2 rounded-md text-white hover:bg-white/5"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-[#E4002B] flex items-center justify-center"><span className="text-white font-bold">H</span></div>
            <span className="font-heading font-semibold">Auto Peças Honda</span>
          </div>
          <div className="w-9" />
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
          <Outlet />
        </main>

        <footer className="border-t border-white/10 px-6 lg:px-10 py-6 text-center">
          <p className="text-sm text-zinc-400">Sistema desenvolvido para facilitar seu negócio</p>
          <p className="text-xs text-zinc-600 mt-1">Desenvolvido por <span className="text-[#E4002B] font-medium">Mateus Oliveira</span></p>
        </footer>
      </div>
    </div>
  );
}

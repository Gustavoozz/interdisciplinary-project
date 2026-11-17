import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CalendarCheck, GraduationCap, LayoutDashboard, LogOut, Menu, Settings, TrendingUp, Users, X } from "lucide-react";
import { logout } from "../lib/data";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/estagiarios", label: "Estagiários", icon: Users },
  { to: "/desempenho", label: "Desempenho", icon: TrendingUp },
  { to: "/frequencia", label: "Frequência", icon: CalendarCheck },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
];

const NOTIFS = [
  "3 justificativas de falta aguardam revisão",
  "Avaliação de Diego Alves vence em 2 dias",
  "Novo estagiário cadastrado em Database",
];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col bg-white px-4 py-6">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy text-white"><GraduationCap size={20} /></span>
        <span className="text-lg font-bold text-navy">Estagia<span className="text-iris">Hub</span></span>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to} to={to} onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive ? "bg-ice text-navy" : "text-slate-500 hover:bg-slate-50 hover:text-navy"
              }`
            }
          >
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={() => { logout(); navigate("/login"); }}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
      >
        <LogOut size={18} /> Sair
      </button>
    </div>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [bell, setBell] = useState(false);
  const { pathname } = useLocation();
  const title = NAV.find((n) => pathname.startsWith(n.to))?.label ?? "Dashboard";

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200/70 lg:block">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-navy/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside className="fixed inset-y-0 left-0 z-50 w-64 shadow-xl lg:hidden" initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ duration: 0.2 }}>
              <button className="absolute right-3 top-4 text-slate-400" onClick={() => setOpen(false)} aria-label="Fechar menu"><X size={20} /></button>
              <Sidebar onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/70 bg-white/80 px-4 py-3 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button className="btn-ghost !p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Abrir menu"><Menu size={18} /></button>
            <span className="text-sm font-semibold text-navy">{title}</span>
          </div>
          <div className="relative flex items-center gap-3">
            <button className="btn-ghost relative !p-2" onClick={() => setBell(!bell)} aria-label="Notificações">
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-500" />
            </button>
            {bell && (
              <div className="card absolute right-0 top-12 w-72 p-2 shadow-lg">
                {NOTIFS.map((n) => <p key={n} className="rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-50">{n}</p>)}
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-navy text-xs font-bold text-white">AD</span>
              <div className="hidden leading-tight sm:block">
                <p className="text-sm font-semibold text-navy">Admin</p>
                <p className="text-xs text-slate-500">admin@empresa.com</p>
              </div>
            </div>
          </div>
        </header>

        <motion.main key={pathname} className="mx-auto max-w-7xl p-4 sm:p-8" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}

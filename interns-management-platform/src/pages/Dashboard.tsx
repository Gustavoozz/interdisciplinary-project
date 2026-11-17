import { useState } from "react";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, ClipboardCheck, Code2, Database, Download, Megaphone, Palette, Pencil, Server, UserPlus, type LucideIcon } from "lucide-react";
import { SEED, TEAMS, TEAM_COLOR, useLocalStorage, type Intern, type Team } from "../lib/data";

const ICONS: Record<Team, LucideIcon> = { "Front-End": Code2, "Back-End": Server, Design: Palette, Database, Marketing: Megaphone };
const MESES = ["Jun", "Jul", "Ago", "Set", "Out", "Nov"];
const BASE: Record<Team, number[]> = {
  "Front-End": [610, 680, 720, 790, 860, 910],
  "Back-End": [580, 600, 690, 720, 760, 830],
  Design: [700, 660, 720, 780, 750, 820],
  Database: [540, 590, 610, 650, 720, 740],
  Marketing: [500, 560, 540, 620, 660, 700],
};
const EVOLUCAO = MESES.map((mes, i) => ({ mes, ...Object.fromEntries(TEAMS.map((t) => [t, BASE[t][i]])) }));
const PRODUTIVIDADE = MESES.map((mes, i) => ({ mes, indice: [62, 68, 71, 77, 82, 88][i] }));
const FREQ = [
  { nome: "Presenças", valor: 52.1, cor: "#22a06b" },
  { nome: "Faltas", valor: 22.8, cor: "#e5484d" },
  { nome: "Atrasos", valor: 13.9, cor: "#f59e0b" },
  { nome: "Justificativas", valor: 11.2, cor: "#8aa4c8" },
];
const ATIVIDADES = [
  { icon: UserPlus, texto: "Isabela Rocha foi cadastrada em Database", tempo: "há 2 h" },
  { icon: ClipboardCheck, texto: "Avaliação de Ana Souza registrada", tempo: "há 5 h" },
  { icon: Pencil, texto: "Cargo de Felipe Costa atualizado", tempo: "ontem" },
  { icon: AlertTriangle, texto: "3 justificativas aguardam revisão", tempo: "ontem", alerta: true },
];

const nivel = (p: number) =>
  p >= 800 ? { t: "Alto", c: "bg-emerald-50 text-emerald-700" }
  : p >= 650 ? { t: "Médio", c: "bg-blue-50 text-blue-700" }
  : { t: "Atenção", c: "bg-orange-50 text-orange-700" };

export default function Dashboard() {
  const [interns] = useLocalStorage<Intern[]>("interns", SEED);
  const [periodo, setPeriodo] = useState(6);
  const [ocultas, setOcultas] = useState<string[]>([]);
  const ativos = interns.filter((i) => i.status !== "Desligado");
  const top = [...ativos].sort((a, b) => b.pontos - a.pontos).slice(0, 5);
  const toggle = (k: string) => setOcultas((o) => (o.includes(k) ? o.filter((x) => x !== k) : [...o, k]));

  const exportar = () => {
    const head = ["Nome", "E-mail", "Equipe", "Cargo", "Admissão", "Status", "Pontuação"];
    const rows = interns.map((i) => [i.nome, i.email, i.equipe, i.cargo, i.admissao, i.status, i.pontos]);
    const csv = [head, ...rows].map((r) => r.map((c) => `"${c}"`).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = "estagiarios.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Bem-vindo de volta, Admin!</h1>
          <p className="text-sm text-slate-500">Confira informações gerais sobre seus estagiários.</p>
        </div>
        <button className="btn-primary" onClick={exportar}><Download size={16} /> Exportar dados</button>
      </div>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {TEAMS.map((t) => {
          const Icon = ICONS[t];
          return (
            <motion.div key={t} className="card relative overflow-hidden p-4" whileHover={{ y: -2 }}>
              <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: TEAM_COLOR[t] + "1a", color: TEAM_COLOR[t] }}><Icon size={18} /></span>
              <p className="mt-3 text-sm font-semibold text-navy">{t}</p>
              <p className="text-xs text-slate-500">Integrantes: {ativos.filter((i) => i.equipe === t).length}</p>
              <span className="absolute inset-x-0 bottom-0 h-1" style={{ background: TEAM_COLOR[t] }} />
            </motion.div>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-navy">Evolução de desempenho</h2>
            <select className="input !w-auto !py-1.5" value={periodo} onChange={(e) => setPeriodo(Number(e.target.value))} aria-label="Período">
              <option value={3}>Últimos 3 meses</option>
              <option value={6}>Últimos 6 meses</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={EVOLUCAO.slice(-periodo)}>
                <CartesianGrid stroke="#eef1f6" vertical={false} />
                <XAxis dataKey="mes" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} domain={[400, 1000]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Legend onClick={(e: any) => toggle(e.dataKey)} wrapperStyle={{ cursor: "pointer", fontSize: 12 }} />
                {TEAMS.map((t) => (
                  <Line key={t} dataKey={t} stroke={TEAM_COLOR[t]} strokeWidth={2.5} dot={false} hide={ocultas.includes(t)} animationDuration={900} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-1 text-xs text-slate-400">Clique na legenda para ocultar ou exibir uma equipe.</p>
        </div>

        <div className="card p-5">
          <h2 className="mb-4 font-semibold text-navy">Integrantes em destaque</h2>
          <ul className="space-y-4">
            {top.map((i) => {
              const n = nivel(i.pontos);
              return (
                <li key={i.id}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">{i.nome}</p>
                      <p className="text-xs text-slate-500">{i.equipe} · {i.pontos} pts</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${n.c}`}>{n.t}</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-iris" style={{ width: `${i.pontos / 10}%` }} /></div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5">
          <h2 className="mb-4 font-semibold text-navy">Produtividade mensal</h2>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={PRODUTIVIDADE}>
                <CartesianGrid stroke="#eef1f6" vertical={false} />
                <XAxis dataKey="mes" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip cursor={{ fill: "#f1f5f9" }} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="indice" name="Índice" fill="#5b4a9e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="mb-2 font-semibold text-navy">Frequência</h2>
          <div className="h-36">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={FREQ} dataKey="valor" nameKey="nome" innerRadius={42} outerRadius={64} paddingAngle={2} stroke="none">
                  {FREQ.map((f) => <Cell key={f.nome} fill={f.cor} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-2 text-sm">
            {FREQ.map((f) => (
              <li key={f.nome} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: f.cor }} />
                <span className="flex-1 text-slate-600">{f.nome}</span>
                <span className="font-medium text-slate-800">{f.valor}%</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-5">
          <h2 className="mb-4 font-semibold text-navy">Atividade recente</h2>
          <ul className="space-y-4">
            {ATIVIDADES.map(({ icon: Icon, texto, tempo, alerta }) => (
              <li key={texto} className="flex gap-3">
                <span className={`grid h-8 w-8 flex-none place-items-center rounded-lg ${alerta ? "bg-orange-50 text-orange-600" : "bg-ice text-navy"}`}><Icon size={16} /></span>
                <div>
                  <p className="text-sm text-slate-700">{texto}</p>
                  <p className="text-xs text-slate-400">{tempo}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

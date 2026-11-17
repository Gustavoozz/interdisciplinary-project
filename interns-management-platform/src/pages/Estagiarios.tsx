import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { SEED, STATUSES, TEAMS, useLocalStorage, type Intern } from "../lib/data";

const schema = z.object({
  nome: z.string().min(3, "Informe o nome completo"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  equipe: z.enum(TEAMS),
  cargo: z.string().min(2, "Informe o cargo"),
  admissao: z.string().min(1, "Informe a data de admissão"),
  supervisor: z.string().min(3, "Informe o supervisor"),
  status: z.enum(STATUSES),
});
type FormData = z.infer<typeof schema>;

const BADGE: Record<string, string> = {
  Ativo: "bg-emerald-50 text-emerald-700",
  "Em avaliação": "bg-amber-50 text-amber-700",
  Desligado: "bg-red-50 text-red-700",
};
const TEXT_FIELDS = [
  ["nome", "Nome completo", "text"], ["email", "E-mail", "email"], ["telefone", "Telefone", "tel"],
  ["cargo", "Cargo", "text"], ["admissao", "Data de admissão", "date"], ["supervisor", "Supervisor responsável", "text"],
] as const;

function Modal({ initial, onClose, onSave }: { initial: Intern | null; onClose: () => void; onSave: (d: FormData) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial ?? { equipe: "Front-End", status: "Ativo" },
  });
  return (
    <motion.div className="fixed inset-0 z-50 grid place-items-center bg-navy/40 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.form
        onSubmit={handleSubmit(onSave)} noValidate
        className="card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6"
        initial={{ y: 16, scale: 0.98 }} animate={{ y: 0, scale: 1 }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-navy">{initial ? "Editar estagiário" : "Adicionar estagiário"}</h2>
          <button type="button" onClick={onClose} aria-label="Fechar" className="text-slate-400 hover:text-navy"><X size={20} /></button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {TEXT_FIELDS.map(([name, label, type]) => (
            <div key={name} className={name === "nome" ? "sm:col-span-2" : ""}>
              <label className="label" htmlFor={name}>{label}</label>
              <input id={name} type={type} className="input" {...register(name)} />
              {errors[name] && <p className="err">{errors[name]?.message}</p>}
            </div>
          ))}
          <div>
            <label className="label" htmlFor="equipe">Equipe</label>
            <select id="equipe" className="input" {...register("equipe")}>{TEAMS.map((t) => <option key={t}>{t}</option>)}</select>
          </div>
          <div>
            <label className="label" htmlFor="status">Status</label>
            <select id="status" className="input" {...register("status")}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn-primary">Salvar</button>
        </div>
      </motion.form>
    </motion.div>
  );
}

export default function Estagiarios() {
  const [list, setList] = useLocalStorage<Intern[]>("interns", SEED);
  const [q, setQ] = useState("");
  const [team, setTeam] = useState("");
  const [status, setStatus] = useState("");
  const [editing, setEditing] = useState<Intern | "new" | null>(null);
  const [toast, setToast] = useState("");

  const filtered = useMemo(
    () => list.filter((i) => i.nome.toLowerCase().includes(q.toLowerCase()) && (!team || i.equipe === team) && (!status || i.status === status)),
    [list, q, team, status]
  );
  const notify = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const save = (d: FormData) => {
    if (editing === "new") setList([{ ...d, id: Date.now().toString(), pontos: 600 }, ...list]);
    else if (editing) setList(list.map((i) => (i.id === editing.id ? { ...i, ...d } : i)));
    notify(editing === "new" ? "Estagiário cadastrado com sucesso." : "Alterações salvas.");
    setEditing(null);
  };
  const remove = (i: Intern) => {
    if (window.confirm(`Excluir o registro de ${i.nome}?`)) { setList(list.filter((x) => x.id !== i.id)); notify("Registro excluído."); }
  };

  const kpis = [
    ["Total de estagiários", list.length],
    ["Ativos", list.filter((i) => i.status === "Ativo").length],
    ["Em avaliação", list.filter((i) => i.status === "Em avaliação").length],
    ["Desligados", list.filter((i) => i.status === "Desligado").length],
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Gerenciamento de Estagiários</h1>
        <p className="text-sm text-slate-500">Visualize, organize e acompanhe os integrantes da organização.</p>
      </div>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map(([l, v]) => (
          <div key={l} className="card p-4">
            <p className="text-xs text-slate-500">{l}</p>
            <p className="mt-1 text-2xl font-bold text-navy">{v}</p>
          </div>
        ))}
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-9" placeholder="Pesquisar por nome" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="input !w-auto" value={team} onChange={(e) => setTeam(e.target.value)} aria-label="Filtrar por equipe">
          <option value="">Todas as equipes</option>{TEAMS.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select className="input !w-auto" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filtrar por status">
          <option value="">Todos os status</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className="btn-primary" onClick={() => setEditing("new")}><Plus size={16} /> Adicionar estagiário</button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-slate-100 text-xs text-slate-500">
            <tr>{["Nome", "E-mail", "Equipe", "Cargo", "Admissão", "Status", "Desempenho", "Ações"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((i) => (
              <tr key={i.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                <td className="px-4 py-3 font-medium text-slate-800">{i.nome}</td>
                <td className="px-4 py-3 text-slate-500">{i.email}</td>
                <td className="px-4 py-3">{i.equipe}</td>
                <td className="px-4 py-3 text-slate-500">{i.cargo}</td>
                <td className="px-4 py-3 text-slate-500">{new Date(i.admissao + "T00:00").toLocaleDateString("pt-BR")}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${BADGE[i.status]}`}>{i.status}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 rounded-full bg-slate-100"><div className="h-full rounded-full bg-iris" style={{ width: `${i.pontos / 10}%` }} /></div>
                    <span className="text-xs text-slate-500">{i.pontos}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button className="rounded-lg p-2 text-slate-500 hover:bg-ice hover:text-navy" onClick={() => setEditing(i)} aria-label={`Editar ${i.nome}`}><Pencil size={16} /></button>
                    <button className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" onClick={() => remove(i)} aria-label={`Excluir ${i.nome}`}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-500">Nenhum estagiário encontrado. Ajuste os filtros ou adicione um novo.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {editing && <Modal key="modal" initial={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSave={save} />}
        {toast && (
          <motion.div key="toast" className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-navy px-4 py-3 text-sm text-white shadow-lg" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <CheckCircle2 size={16} className="text-emerald-400" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

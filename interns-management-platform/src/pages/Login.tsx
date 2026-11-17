import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { BarChart3, CalendarCheck, Eye, EyeOff, GraduationCap, Loader2, Users } from "lucide-react";
import { DEMO, isAuth } from "../lib/data";

const schema = z.object({
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
  senha: z.string().min(1, "Informe a senha").min(6, "A senha deve ter ao menos 6 caracteres"),
  lembrar: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const [ver, setVer] = useState(false);
  const [erro, setErro] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  if (isAuth()) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (d: FormData) => {
    setErro("");
    await new Promise((r) => setTimeout(r, 900)); // simula chamada ao servidor
    if (d.email === DEMO.email && d.senha === DEMO.senha) {
      (d.lembrar ? localStorage : sessionStorage).setItem("auth", JSON.stringify({ email: d.email }));
      navigate("/dashboard");
    } else {
      setErro("E-mail ou senha incorretos.");
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-navy p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute -right-4 top-10 h-60 w-60 rounded-full border border-white/10" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-iris/30" />
        <div className="relative flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10"><GraduationCap size={20} /></span>
          <span className="text-lg font-bold">EstagiaHub</span>
        </div>
        <div className="relative max-w-md">
          <h2 className="text-3xl font-bold leading-tight">Toda a sua equipe de estagiários em um só painel.</h2>
          <ul className="mt-8 space-y-4 text-sm text-white/80">
            <li className="flex items-center gap-3"><Users size={18} /> Cadastro e acompanhamento por equipe</li>
            <li className="flex items-center gap-3"><BarChart3 size={18} /> Indicadores de desempenho em tempo real</li>
            <li className="flex items-center gap-3"><CalendarCheck size={18} /> Controle de frequência e justificativas</li>
          </ul>
        </div>
        <p className="relative text-xs text-white/50">© 2026 EstagiaHub</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <motion.form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} noValidate>
          <h1 className="text-2xl font-bold text-navy">Bem-vindo de volta!</h1>
          <p className="mt-1 text-sm text-slate-500">Acesse sua conta para acompanhar sua equipe.</p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="label" htmlFor="email">E-mail</label>
              <input id="email" type="email" className="input" placeholder="voce@empresa.com" {...register("email")} />
              {errors.email && <p className="err">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label" htmlFor="senha">Senha</label>
              <div className="relative">
                <input id="senha" type={ver ? "text" : "password"} className="input pr-10" placeholder="••••••••" {...register("senha")} />
                <button type="button" onClick={() => setVer(!ver)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy" aria-label={ver ? "Ocultar senha" : "Mostrar senha"}>
                  {ver ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.senha && <p className="err">{errors.senha.message}</p>}
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600"><input type="checkbox" className="accent-iris" {...register("lembrar")} /> Lembrar acesso</label>
              <a href="#" className="font-medium text-iris hover:underline">Esqueci a senha</a>
            </div>
          </div>

          {erro && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">{erro}</p>}

          <button className="btn-primary mt-6 w-full" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Entrando...</> : "Entrar"}
          </button>
          <p className="mt-6 rounded-xl bg-ice px-3 py-2 text-xs text-slate-600">
            Demonstração: <strong>{DEMO.email}</strong> / <strong>{DEMO.senha}</strong>
          </p>
        </motion.form>
      </div>
    </div>
  );
}

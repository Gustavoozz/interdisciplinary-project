import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Estagiarios from "./pages/Estagiarios";
import { isAuth } from "./lib/data";

const Guard = () => (isAuth() ? <Layout /> : <Navigate to="/login" replace />);

const Soon = ({ title }: { title: string }) => (
  <div className="card p-10 text-center">
    <h1 className="text-xl font-semibold text-navy">{title}</h1>
    <p className="mt-2 text-sm text-slate-500">Esta página será a próxima etapa do projeto.</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Guard />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/estagiarios" element={<Estagiarios />} />
          <Route path="/desempenho" element={<Soon title="Desempenho e Avaliações" />} />
          <Route path="/frequencia" element={<Soon title="Controle de Frequência" />} />
          <Route path="/configuracoes" element={<Soon title="Configurações" />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

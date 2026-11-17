import { useEffect, useState } from "react";

export const TEAMS = ["Front-End", "Back-End", "Design", "Database", "Marketing"] as const;
export const STATUSES = ["Ativo", "Em avaliação", "Desligado"] as const;
export type Team = (typeof TEAMS)[number];
export type Status = (typeof STATUSES)[number];

export interface Intern {
  id: string; nome: string; email: string; telefone: string; equipe: Team;
  cargo: string; admissao: string; supervisor: string; status: Status; pontos: number;
}

export const TEAM_COLOR: Record<Team, string> = {
  "Front-End": "#5b4a9e", "Back-End": "#0b2545", Design: "#3b82f6",
  Database: "#22a06b", Marketing: "#f59e0b",
};

export const DEMO = { email: "admin@empresa.com", senha: "admin123" };
export const isAuth = () => !!(localStorage.getItem("auth") || sessionStorage.getItem("auth"));
export const logout = () => { localStorage.removeItem("auth"); sessionStorage.removeItem("auth"); };

const SUP: Record<Team, string> = {
  "Front-End": "Marcos Teixeira", "Back-End": "Patrícia Gomes", Design: "Renata Vilela",
  Database: "Otávio Prado", Marketing: "Luciana Faria",
};

const rows: [string, Team, string, string, Status, number][] = [
  ["Ana Souza", "Front-End", "Estagiária de Front-End", "2026-02-03", "Ativo", 910],
  ["Bruno Lima", "Back-End", "Estagiário de APIs", "2026-02-03", "Ativo", 830],
  ["Carla Mendes", "Design", "Estagiária de UX/UI", "2026-03-10", "Ativo", 820],
  ["Diego Alves", "Database", "Estagiário de Dados", "2026-03-10", "Em avaliação", 740],
  ["Elisa Ramos", "Marketing", "Estagiária de Conteúdo", "2026-04-14", "Ativo", 700],
  ["Felipe Costa", "Front-End", "Estagiário de Front-End", "2026-04-14", "Em avaliação", 680],
  ["Gabriela Nunes", "Back-End", "Estagiária de Back-End", "2026-05-05", "Ativo", 790],
  ["Henrique Dias", "Design", "Estagiário de Design", "2026-05-05", "Desligado", 540],
  ["Isabela Rocha", "Database", "Estagiária de BI", "2026-06-02", "Ativo", 765],
  ["João Pedro", "Marketing", "Estagiário de Social Media", "2026-06-02", "Ativo", 655],
];

export const SEED: Intern[] = rows.map(([nome, equipe, cargo, admissao, status, pontos], i) => ({
  id: String(i + 1), nome, equipe, cargo, admissao, status, pontos,
  email: `${nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(" ")[0].toLowerCase()}@empresa.com`,
  telefone: `(11) 98888-00${10 + i}`,
  supervisor: SUP[equipe],
}));

/** useState que persiste no LocalStorage */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue] as const;
}

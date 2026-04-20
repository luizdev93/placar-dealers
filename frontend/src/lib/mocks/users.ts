import { User } from "@/lib/types";

export const mockUsers: User[] = [
  {
    id: "user_1",
    nome: "João Silva",
    email: "joao.silva@sernissan.com.br",
    perfil: "consultor",
    avatarInitials: "JS",
    regiao: "Sudeste",
  },
  {
    id: "user_2",
    nome: "Maria Fernandes",
    email: "maria.fernandes@sernissan.com.br",
    perfil: "gerente_regional",
    avatarInitials: "MF",
    regiao: "Sudeste",
  },
  {
    id: "user_3",
    nome: "Admin Sistema",
    email: "admin@sernissan.com.br",
    perfil: "admin",
    avatarInitials: "AS",
  },
  {
    id: "user_4",
    nome: "Carlos Mendes",
    email: "carlos.mendes@nissannorte.com.br",
    perfil: "operador",
    dealerId: "dealer_2",
    avatarInitials: "CM",
    cargo: "Operador de Vendas",
  },
  {
    id: "user_5",
    nome: "Pedro Alves",
    email: "pedro.alves@nissancentro.com.br",
    perfil: "gerente_dealer",
    dealerId: "dealer_1",
    avatarInitials: "PA",
    cargo: "Gerente Comercial",
  },
  {
    id: "user_6",
    nome: "Ana Costa",
    email: "ana.costa@sernissan.com.br",
    perfil: "consultor",
    avatarInitials: "AC",
    regiao: "Sul",
  },
  {
    id: "user_7",
    nome: "Rodrigo Lima",
    email: "rodrigo.lima@nissancentro.com.br",
    perfil: "operador",
    dealerId: "dealer_1",
    avatarInitials: "RL",
    cargo: "Coordenador de Pós-Venda",
  },
  {
    id: "user_8",
    nome: "Fátima Souza",
    email: "fatima.souza@nissancentro.com.br",
    perfil: "gerente_dealer",
    dealerId: "dealer_1",
    avatarInitials: "FS",
    cargo: "Diretora Geral",
  },
  {
    id: "user_9",
    nome: "Marcos Oliveira",
    email: "marcos.oliveira@nissansul.com.br",
    perfil: "operador",
    dealerId: "dealer_3",
    avatarInitials: "MO",
    cargo: "Supervisor de Serviços",
  },
  {
    id: "user_10",
    nome: "Beatriz Campos",
    email: "beatriz.campos@nissansul.com.br",
    perfil: "gerente_dealer",
    dealerId: "dealer_3",
    avatarInitials: "BC",
    cargo: "Gerente de Operações",
  },
];

export const getOperadoresByDealer = (dealerId: string): User[] =>
  mockUsers.filter((u) => u.perfil === "operador" && u.dealerId === dealerId);

export const getGerentesByDealer = (dealerId: string): User[] =>
  mockUsers.filter((u) => u.perfil === "gerente_dealer" && u.dealerId === dealerId);

export const getMockUserById = (id: string): User | undefined =>
  mockUsers.find((u) => u.id === id);

export const getConsultores = (): User[] =>
  mockUsers.filter((u) => u.perfil === "consultor");

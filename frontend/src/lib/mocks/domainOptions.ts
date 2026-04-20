import { DomainOption } from "@/lib/types";

export const mockFocusOptions: DomainOption[] = [
  { id: "foco_1", label: "Vendas de Veículos Novos", ativo: true },
  { id: "foco_2", label: "Pós-Venda e Serviços", ativo: true },
  { id: "foco_3", label: "Satisfação do Cliente (NPS)", ativo: true },
  { id: "foco_4", label: "Treinamento de Equipe", ativo: true },
  { id: "foco_5", label: "Gestão de Estoque", ativo: true },
  { id: "foco_6", label: "Marketing e Comunicação", ativo: true },
  { id: "foco_7", label: "Finanças e Rentabilidade", ativo: true },
  { id: "foco_8", label: "Processos Operacionais", ativo: false },
];

export const mockModalityOptions: DomainOption[] = [
  { id: "mod_1", label: "Presencial", ativo: true },
  { id: "mod_2", label: "Remota (Videoconferência)", ativo: true },
  { id: "mod_3", label: "Híbrida", ativo: true },
  { id: "mod_4", label: "Telefônica", ativo: false },
];

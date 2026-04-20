import { ScheduledVisit } from "@/lib/types";

export const mockScheduledVisits: ScheduledVisit[] = [
  {
    id: "visit_1",
    dealerId: "dealer_1",
    consultorId: "user_1",
    data: "2026-04-25",
    horaInicio: "09:00",
    horaFim: "11:00",
    objetivo:
      "Acompanhamento do plano de ação de vendas e avaliação do progresso no mix de estoque. Revisão dos KPIs do mês.",
    status: "confirmado",
  },
  {
    id: "visit_2",
    dealerId: "dealer_3",
    consultorId: "user_6",
    data: "2026-04-28",
    horaInicio: "14:00",
    horaFim: "16:00",
    objetivo:
      "Revisão do NPS e avaliação das ações implementadas para melhoria do processo de entrega de veículos.",
    status: "pendente",
  },
  {
    id: "visit_3",
    dealerId: "dealer_2",
    consultorId: "user_1",
    data: "2026-05-05",
    horaInicio: "10:00",
    horaFim: "12:00",
    objetivo:
      "Avaliação do follow-up de pós-venda e campanha de revisão para mid-week.",
    status: "declinado",
    motivoDeclinado:
      "Semana de feira no estado. Equipe reduzida. Solicito reagendamento para 12/05.",
  },
  {
    id: "visit_4",
    dealerId: "dealer_4",
    consultorId: "user_1",
    data: "2026-05-12",
    horaInicio: "08:30",
    horaFim: "11:30",
    objetivo:
      "Revisão do plano comercial Q2, metas por modelo e alinhamento com ações de mídia regional.",
    status: "confirmado",
  },
  {
    id: "visit_5",
    dealerId: "dealer_5",
    consultorId: "user_6",
    data: "2026-05-14",
    horaInicio: "13:00",
    horaFim: "15:00",
    objetivo:
      "Diagnóstico de estoque envelhecido e definição de estratégia de liquidação com a equipe de usados.",
    status: "pendente",
  },
  {
    id: "visit_6",
    dealerId: "dealer_2",
    consultorId: "user_6",
    data: "2026-05-20",
    horaInicio: "09:00",
    horaFim: "12:00",
    objetivo:
      "Treinamento rápido da equipe de vendas sobre o novo fluxo de financiamento e simulação no DMS.",
    status: "confirmado",
  },
  {
    id: "visit_7",
    dealerId: "dealer_1",
    consultorId: "user_6",
    data: "2026-05-22",
    horaInicio: "10:00",
    horaFim: "11:30",
    objetivo:
      "Follow-up das ações de pós-venda acordadas na última visita e checagem dos indicadores de satisfação.",
    status: "pendente",
  },
  {
    id: "visit_8",
    dealerId: "dealer_3",
    consultorId: "user_1",
    data: "2026-06-02",
    horaInicio: "14:30",
    horaFim: "17:00",
    objetivo:
      "Auditoria visual de showroom e padrão de exposição; alinhamento com manual de identidade da marca.",
    status: "confirmado",
  },
  {
    id: "visit_9",
    dealerId: "dealer_5",
    consultorId: "user_1",
    data: "2026-06-10",
    horaInicio: "08:00",
    horaFim: "10:00",
    objetivo:
      "Reunião com gestão para priorização de recall em aberto e capacidade de oficina na alta temporada.",
    status: "pendente",
  },
  {
    id: "visit_10",
    dealerId: "dealer_2",
    consultorId: "user_1",
    data: "2026-06-16",
    horaInicio: "09:30",
    horaFim: "11:30",
    objetivo:
      "Alinhamento de metas semestrais e revisão do funil de vendas com foco em financiamento próprio.",
    status: "confirmado",
  },
  {
    id: "visit_11",
    dealerId: "dealer_1",
    consultorId: "user_1",
    data: "2026-06-19",
    horaInicio: "14:00",
    horaFim: "16:00",
    objetivo:
      "Benchmark interno de tempo de entrega técnica e proposta de checklist para redução de retrabalho.",
    status: "pendente",
  },
  {
    id: "visit_12",
    dealerId: "dealer_4",
    consultorId: "user_1",
    data: "2026-06-24",
    horaInicio: "10:00",
    horaFim: "12:30",
    objetivo:
      "Visita de suporte à campanha de trade-in e precificação de usados com parceiros financeiros.",
    status: "confirmado",
  },
  {
    id: "visit_13",
    dealerId: "dealer_3",
    consultorId: "user_1",
    data: "2026-07-03",
    horaInicio: "08:30",
    horaFim: "10:30",
    objetivo:
      "Acompanhamento do indicador de conversão digital e ajuste do script de contato da equipe de BDC.",
    status: "pendente",
  },
];

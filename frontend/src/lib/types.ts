export type UserProfile =
  | "consultor"
  | "gerente_regional"
  | "admin"
  | "operador"
  | "gerente_dealer";

export interface User {
  id: string;
  nome: string;
  email: string;
  perfil: UserProfile;
  dealerId?: string;
  avatarInitials: string;
  regiao?: string;
  cargo?: string;
}

export type RVStatus =
  | "rascunho"
  | "enviado"
  | "lembrete1"
  | "lembrete2"
  | "assinado"
  | "expirado";

export interface NextStep {
  id: string;
  descricao: string;
  responsavel: string;
  prazo: string;
  concluido: boolean;
}

export interface Participant {
  id: string;
  nome: string;
  cargo: string;
  tipo: "dealer" | "consultor";
}

export interface Attachment {
  id: string;
  nome: string;
  tipo: "pdf" | "image" | "doc" | "video";
  tamanho: string;
  urlFake: string;
}

export interface RVReport {
  id: string;
  dealerId: string;
  consultorId: string;
  operadorId?: string;
  gerentesIds?: string[];
  dataVisita: string;
  horaInicio: string;
  horaFim: string;
  modalidade: string;
  foco: string;
  relato: string;
  pontosDestaque: string;
  proximosPassos: NextStep[];
  avaliacaoConsultor: string;
  status: RVStatus;
  dataCriacao: string;
  dataEnvio?: string;
  dataLembrete1?: string;
  dataLembrete2?: string;
  dataAssinatura?: string;
  dataExpiracao?: string;
  participantes: Participant[];
  anexos: Attachment[];
  comentarioCiencia?: string;
  tokenCiencia?: string;
}

export interface Dealer {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  cnpj: string;
  regiao: string;
}

export interface ScheduledVisit {
  id: string;
  dealerId: string;
  consultorId: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  objetivo: string;
  status: "confirmado" | "pendente" | "declinado";
  motivoDeclinado?: string;
}

export interface SignatureSession {
  token: string;
  rvId: string;
  operadorId: string;
  dealerId: string;
  status: "pendente" | "assinado";
  dataAssinatura?: string;
  hashFake?: string;
  comentario?: string;
}

export interface DomainOption {
  id: string;
  label: string;
  ativo: boolean;
}

export interface RVFiltersState {
  dealerId: string;
  consultorId: string;
  status: string;
  dataInicio: string;
  dataFim: string;
  regiao: string;
}

export interface StatusConfig {
  label: string;
  badgeClass: string;
  dotColor: string;
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { RVStatus, StatusConfig } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const statusConfig: Record<RVStatus, StatusConfig> = {
  rascunho: {
    label: "Rascunho",
    badgeClass: "badge-rascunho",
    dotColor: "#616161",
  },
  enviado: {
    label: "Enviado",
    badgeClass: "badge-enviado",
    dotColor: "#1976d2",
  },
  lembrete1: {
    label: "Lembrete 1",
    badgeClass: "badge-lembrete1",
    dotColor: "#f57c00",
  },
  lembrete2: {
    label: "Lembrete 2",
    badgeClass: "badge-lembrete2",
    dotColor: "#e65100",
  },
  assinado: {
    label: "Assinado",
    badgeClass: "badge-assinado",
    dotColor: "#388e3c",
  },
  expirado: {
    label: "Expirado",
    badgeClass: "badge-expirado",
    dotColor: "#d32f2f",
  },
};

export function formatDate(isoDate: string): string {
  if (!isoDate) return "—";
  const date = new Date(isoDate);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(isoDate: string): string {
  if (!isoDate) return "—";
  const date = new Date(isoDate);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(time: string): string {
  return time || "—";
}

export function generateFakeHash(rvId: string): string {
  const chars = "ABCDEF0123456789";
  let hash = "";
  for (let i = 0; i < 8; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return `RV-${rvId.toUpperCase()}-SHA#${hash}`;
}

export function generateFakeToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token = "tok_";
  for (let i = 0; i < 12; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

export function getFileIcon(tipo: "pdf" | "image" | "doc"): string {
  switch (tipo) {
    case "pdf":
      return "📄";
    case "image":
      return "🖼️";
    case "doc":
      return "📊";
    default:
      return "📎";
  }
}

export const FAKE_AI_IMPROVED_TEXT = (original: string): string => {
  if (!original || original.length < 10) return original;
  return (
    original
      .replace(/foi realizada/gi, "ocorreu de forma produtiva")
      .replace(/apresentou/gi, "evidenciou")
      .replace(/identificamos/gi, "constatamos")
      .replace(/demonstrou/gi, "revelou")
      .replace(/conversamos/gi, "discutimos em profundidade")
      .replace(/\. /g, ". Cabe destacar que ") +
    " Os dados apresentados corroboram a necessidade de ações imediatas e estruturadas para garantir a sustentabilidade dos resultados."
  );
};

export const FAKE_AUDIO_TRANSCRIPTION =
  "Conforme alinhado durante a visita, identificamos oportunidades de melhoria nos processos de atendimento ao cliente e gestão de indicadores. A equipe demonstrou comprometimento e abertura para as sugestões apresentadas. Reforçamos a importância de manter o acompanhamento semanal dos KPIs definidos no plano de ação.";

import React from "react";
import { RVReport } from "@/lib/types";
import { FileEdit, Send, Bell, CheckCircle2, XCircle, Copy } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";

interface TimelineEvent {
  id: string;
  label: string;
  date?: string;
  icon: React.ReactNode;
  color: string;
  active: boolean;
  extra?: React.ReactNode;
}

export function RVTimeline({ rv }: { rv: RVReport }) {
  const copyLink = () => {
    const fakeLink = `https://rv.sernissan.com.br/rv/ciencia/${rv.tokenCiencia}`;
    navigator.clipboard.writeText(fakeLink)
      .then(() => toast.success("Link copiado!"))
      .catch(() => toast.error("Não foi possível copiar."));
  };

  const events: TimelineEvent[] = [
    {
      id: "criado", label: "Criado", date: rv.dataCriacao,
      icon: <FileEdit size={11} />, color: "#9e9e9e", active: true,
    },
    {
      id: "enviado", label: "Enviado para ciência", date: rv.dataEnvio,
      icon: <Send size={11} />, color: "#2f3f78", active: !!rv.dataEnvio,
      extra: rv.dataEnvio && rv.tokenCiencia ? (
        <button onClick={copyLink} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#2f3f78", background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: 2 }}>
          <Copy size={9} /> Copiar link
        </button>
      ) : null,
    },
    {
      id: "lembrete1", label: "1º Lembrete", date: rv.dataLembrete1,
      icon: <Bell size={11} />, color: "#b88800", active: !!rv.dataLembrete1,
    },
    {
      id: "lembrete2", label: "2º Lembrete", date: rv.dataLembrete2,
      icon: <Bell size={11} />, color: "#9a6e00", active: !!rv.dataLembrete2,
    },
    {
      id: "assinado", label: "Ciência confirmada", date: rv.dataAssinatura,
      icon: <CheckCircle2 size={11} />, color: "#3d8b2e", active: !!rv.dataAssinatura,
      extra: rv.dataAssinatura ? (
        <p style={{ fontSize: 10, color: "#3d8b2e", fontFamily: "monospace", marginTop: 2, wordBreak: "break-all" }}>
          {`RV-${rv.id.toUpperCase()}-SHA#${rv.id.slice(-8).toUpperCase()}`}
        </p>
      ) : null,
    },
    rv.status === "expirado" ? {
      id: "expirado", label: "Prazo expirado", date: rv.dataExpiracao,
      icon: <XCircle size={11} />, color: "#c0002a", active: !!rv.dataExpiracao,
    } : null,
  ].filter(Boolean) as TimelineEvent[];

  return (
    <div>
      {events.map((event, idx) => (
        <div key={event.id} style={{ display: "flex", gap: 10, position: "relative" }}>
          {idx < events.length - 1 && (
            <div style={{ position: "absolute", left: 11, top: 24, bottom: -4, width: 1, background: "#eeeeee" }} />
          )}
          <div
            style={{
              width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", zIndex: 1, marginTop: 2,
              ...(event.active
                ? { background: event.color, color: "#fff", border: "none" }
                : { background: "#fff", color: "#d0d0d0", border: "1px solid #e8e8e8" }),
            }}
          >
            {event.icon}
          </div>
          <div style={{ paddingBottom: 20, minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: event.active ? "#252525" : "#9e9e9e", lineHeight: 1.3 }}>
              {event.label}
            </p>
            {event.date
              ? <p style={{ fontSize: 11, color: "#9e9e9e", marginTop: 2 }}>{formatDateTime(event.date)}</p>
              : <p style={{ fontSize: 11, color: "#d8d8d8", marginTop: 2, fontStyle: "italic" }}>Pendente</p>
            }
            {event.extra}
          </div>
        </div>
      ))}
    </div>
  );
}

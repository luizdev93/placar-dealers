"use client";

import React from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Pencil, Bell, FileText, Users, MessageSquare, Paperclip, ClipboardList, Send } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { RVStatusBadge } from "@/components/rv/RVStatusBadge";
import { RVTimeline } from "@/components/rv/RVTimeline";
import { RVParticipantsField } from "@/components/rv/RVParticipantsField";
import { RVNextStepsTable } from "@/components/rv/RVNextStepsTable";
import { RVAttachmentsArea } from "@/components/rv/RVAttachmentsArea";
import { RVForm } from "@/components/rv/RVForm";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePermissions } from "@/hooks/usePermissions";
import { useRVContext } from "@/contexts/RVContext";
import { getMockDealerById } from "@/lib/mocks/dealers";
import { getMockUserById } from "@/lib/mocks/users";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid #f5f5f5" }}>
      <span style={{ fontSize: 12, color: "#9e9e9e", width: 120, flexShrink: 0, paddingTop: 1 }}>{label}</span>
      <span style={{ fontSize: 13, color: "#252525" }}>{value || "—"}</span>
    </div>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bubble-card" style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #f0f0f0" }}>
        <span style={{ color: "#9e9e9e" }}>{icon}</span>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: "#252525", margin: 0 }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function RVDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const mode = searchParams.get("mode");
  const isEditMode = mode === "edit";

  const { currentUser } = useCurrentUser();
  const permissions = usePermissions(currentUser);
  const { rvReports } = useRVContext();

  const rv = rvReports.find((r) => r.id === id);

  if (!rv) {
    return (
      <div style={{ padding: "48px 0", textAlign: "center" }}>
        <FileText size={32} style={{ color: "#d8d8d8", margin: "0 auto 10px" }} />
        <p style={{ fontSize: 14, color: "#9e9e9e" }}>Relatório não encontrado</p>
        <Link href="/rv" style={{ fontSize: 13, color: "#000", display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8, textDecoration: "none", fontWeight: 500 }}>
          <ArrowLeft size={13} /> Voltar para lista
        </Link>
      </div>
    );
  }

  const dealer = getMockDealerById(rv.dealerId);
  const consultor = getMockUserById(rv.consultorId);
  const canEdit = permissions.canEditRV(rv);

  if (isEditMode && canEdit) {
    return (
      <>
        <PageHeader
          title="Editar Relatório"
          subtitle={`${dealer?.nome} — ${formatDate(rv.dataVisita)}`}
          actions={
            <Link href={`/rv/${id}`} className="btn-secondary">
              <ArrowLeft size={14} /> Cancelar
            </Link>
          }
        />
        <RVForm initialData={rv} mode="edit" />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={dealer?.nome || rv.dealerId}
        subtitle={`Visita em ${formatDate(rv.dataVisita)} · ${rv.horaInicio}–${rv.horaFim}`}
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/rv" className="btn-secondary">
              <ArrowLeft size={14} /> Lista
            </Link>
            {canEdit && (
              <Link href={`/rv/${id}?mode=edit`} className="btn-primary">
                <Pencil size={14} /> Editar
              </Link>
            )}
            {permissions.canAccessAdmin && (rv.status === "enviado" || rv.status === "lembrete1" || rv.status === "lembrete2") && (
              <button onClick={() => toast.success("Lembrete reenviado (simulado)")} className="btn-secondary">
                <Bell size={14} /> Lembrete
              </button>
            )}
          </div>
        }
      />

      {/* Status bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #f0f0f0" }}>
        <RVStatusBadge status={rv.status} />
        {rv.comentarioCiencia && <span style={{ fontSize: 12, color: "#3d8b2e" }}>· Com comentário</span>}
        {canEdit && rv.status !== "rascunho" && (
          <span style={{ fontSize: 11, color: "#b88800", background: "#FEF8E6", border: "1px solid #FDE68A", padding: "2px 8px", borderRadius: 6 }}>
            Editável — aguardando assinatura
          </span>
        )}
        <span style={{ marginLeft: "auto", fontSize: 11, color: "#9e9e9e" }}>{rv.id.toUpperCase()}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }} className="xl:grid-cols-[1fr_300px]">
        <div>
          <SectionCard title="Informações gerais" icon={<FileText size={14} />}>
            <DetailRow label="Dealer" value={dealer?.nome} />
            <DetailRow label="Localização" value={dealer ? `${dealer.cidade}, ${dealer.estado}` : undefined} />
            <DetailRow label="Consultor" value={consultor?.nome} />
            <DetailRow label="Data" value={formatDate(rv.dataVisita)} />
            <DetailRow label="Horário" value={`${rv.horaInicio} – ${rv.horaFim}`} />
            <DetailRow label="Modalidade" value={rv.modalidade} />
            <DetailRow label="Foco" value={rv.foco} />
          </SectionCard>

          <SectionCard title="Participantes" icon={<Users size={14} />}>
            <RVParticipantsField participants={rv.participantes} onChange={() => {}} readonly />
          </SectionCard>

          <SectionCard title="Relato" icon={<MessageSquare size={14} />}>
            <div className="bubble-block" style={{ fontSize: 13, color: "#252525", lineHeight: 1.6, whiteSpace: "pre-wrap", minHeight: 60 }}>
              {rv.relato || <span style={{ color: "#9e9e9e", fontStyle: "italic" }}>Não informado.</span>}
            </div>
          </SectionCard>

          <SectionCard title="Pontos de destaque" icon={<ClipboardList size={14} />}>
            <div className="bubble-block" style={{ fontSize: 13, color: "#252525", lineHeight: 1.6, whiteSpace: "pre-wrap", minHeight: 40 }}>
              {rv.pontosDestaque || <span style={{ color: "#9e9e9e", fontStyle: "italic" }}>Não informado.</span>}
            </div>
          </SectionCard>

          <SectionCard title="Próximos passos" icon={<Send size={14} />}>
            <RVNextStepsTable steps={rv.proximosPassos} onChange={() => {}} readonly />
          </SectionCard>

          {permissions.canViewAvaliacaoConsultor && rv.avaliacaoConsultor && (
            <SectionCard title="Avaliação do consultor" icon={<MessageSquare size={14} />}>
              <div style={{ fontSize: 12, color: "#92400E", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "6px 10px", marginBottom: 10 }}>
                Uso interno — não visível para o dealer
              </div>
              <div className="bubble-block" style={{ fontSize: 13, color: "#252525", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {rv.avaliacaoConsultor}
              </div>
            </SectionCard>
          )}

          <SectionCard title="Anexos" icon={<Paperclip size={14} />}>
            <RVAttachmentsArea attachments={rv.anexos} onChange={() => {}} readonly />
          </SectionCard>

          {rv.comentarioCiencia && (
            <SectionCard title="Comentário da ciência" icon={<MessageSquare size={14} />}>
              <div style={{ background: "#EDFAE9", border: "1px solid #C6EFC0", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#252525", lineHeight: 1.6 }}>
                {rv.comentarioCiencia}
              </div>
            </SectionCard>
          )}
        </div>

        {/* Timeline sidebar */}
        <div>
          <div className="bubble-card" style={{ position: "sticky", top: 16 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: "#252525", marginBottom: 16, paddingBottom: 10, borderBottom: "1px solid #f0f0f0" }}>Histórico</h2>
            <RVTimeline rv={rv} />
          </div>
        </div>
      </div>
    </>
  );
}

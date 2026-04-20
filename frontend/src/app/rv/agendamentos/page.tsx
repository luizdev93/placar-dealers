"use client";

import React, { useState } from "react";
import { Plus, Calendar, Clock, MapPin, X, Download, XCircle, CheckCircle2, AlertCircle, Loader2, FileText } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePermissions } from "@/hooks/usePermissions";
import { useRVContext } from "@/contexts/RVContext";
import { ScheduledVisit } from "@/lib/types";
import { getMockDealerById } from "@/lib/mocks/dealers";
import { getMockUserById, getConsultores } from "@/lib/mocks/users";
import { mockDealers } from "@/lib/mocks/dealers";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const labelClass = "block text-[10px] font-semibold text-[#999] uppercase tracking-wide mb-1";

function VisitStatusBadge({ status }: { status: ScheduledVisit["status"] }) {
  const config = {
    confirmado: { label: "Confirmado", cls: "bg-[#EDFAE9] text-[#3d8b2e]", icon: <CheckCircle2 size={10} /> },
    pendente: { label: "Pendente", cls: "bg-[#FEF8E6] text-[#b88800]", icon: <AlertCircle size={10} /> },
    declinado: { label: "Declinado", cls: "bg-[#FEF0F2] text-[#c0002a]", icon: <XCircle size={10} /> },
  }[status];
  return (
    <span className={cn("inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium rounded-sm", config.cls)}>
      {config.icon} {config.label}
    </span>
  );
}

export default function AgendamentosPage() {
  const { currentUser } = useCurrentUser();
  const permissions = usePermissions(currentUser);
  const { scheduledVisits, addScheduledVisit, updateScheduledVisit } = useRVContext();
  const consultores = getConsultores();

  const [showNewModal, setShowNewModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [newVisit, setNewVisit] = useState<Partial<ScheduledVisit>>({
    dealerId: "", consultorId: currentUser.perfil === "consultor" ? currentUser.id : "",
    data: "", horaInicio: "09:00", horaFim: "11:00", objetivo: "", status: "pendente",
  });

  const handleDecline = async (id: string) => {
    if (!declineReason.trim()) { toast.error("Informe o motivo."); return; }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    updateScheduledVisit(id, { status: "declinado", motivoDeclinado: declineReason });
    setIsSaving(false);
    setShowDeclineModal(null);
    setDeclineReason("");
    toast.success("Visita declinada.");
  };

  const handleCreate = async () => {
    if (!newVisit.dealerId || !newVisit.data || !newVisit.objetivo) { toast.error("Preencha dealer, data e objetivo."); return; }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    addScheduledVisit({
      id: `visit_${Date.now()}`,
      dealerId: newVisit.dealerId!, consultorId: newVisit.consultorId || currentUser.id,
      data: newVisit.data!, horaInicio: newVisit.horaInicio || "09:00", horaFim: newVisit.horaFim || "11:00",
      objetivo: newVisit.objetivo!, status: "pendente",
    });
    setIsSaving(false);
    setShowNewModal(false);
    setNewVisit({ dealerId: "", consultorId: currentUser.perfil === "consultor" ? currentUser.id : "", data: "", horaInicio: "09:00", horaFim: "11:00", objetivo: "", status: "pendente" });
    toast.success("Visita agendada!");
  };

  const visibleVisits = currentUser.perfil === "consultor"
    ? scheduledVisits.filter((v) => v.consultorId === currentUser.id)
    : scheduledVisits;
  const sorted = [...visibleVisits].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  if (!permissions.canViewAgendamentos) {
    return (
      <div className="py-12 text-center">
        <p className="text-[#888] text-sm">Acesso restrito para este perfil.</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Visitas Agendadas"
        subtitle={`${sorted.length} visita${sorted.length !== 1 ? "s" : ""}${
          currentUser.perfil === "consultor"
            ? ` na sua carteira · visão de todas (${scheduledVisits.length}): perfil Admin ou Gerente Regional`
            : ""
        }`}
        actions={
              permissions.canCreateRV ? (
            <button onClick={() => setShowNewModal(true)} className="btn-primary">
              <Plus size={15} /> Agendar visita
            </button>
          ) : undefined
        }
      />

      {sorted.length === 0 ? (
        <div className="bubble-card" style={{ textAlign: "center", padding: "40px 20px" }}>
          <Calendar size={28} style={{ color: "#d8d8d8", margin: "0 auto 10px" }} />
          <p style={{ fontSize: 14, color: "#888", fontWeight: 500 }}>Nenhuma visita agendada</p>
        </div>
      ) : (
        <div className="bubble-card" style={{ padding: 0, overflow: "hidden" }}>
          {sorted.map((visit) => {
            const dealer = getMockDealerById(visit.dealerId);
            const consultor = getMockUserById(visit.consultorId);
            const visitDate = new Date(visit.data + "T12:00:00");
            return (
              <div key={visit.id} className="flex gap-3 p-4 hover:bg-[#FAFAFA] transition-colors" style={{ borderBottom: "1px solid #f5f5f5" }}>
                <div className="flex-none w-11 h-11 bg-[#FEF0F2] border border-[#f5b8c4] flex flex-col items-center justify-center">
                  <span className="text-[#D80030] text-[9px] font-semibold uppercase leading-none">
                    {visitDate.toLocaleDateString("pt-BR", { month: "short" })}
                  </span>
                  <span className="text-[#D80030] text-base font-bold leading-tight">{visitDate.getDate()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-[13px] font-medium text-[#333]">{dealer?.nome || visit.dealerId}</p>
                    <VisitStatusBadge status={visit.status} />
                  </div>
                  <div className="flex flex-wrap gap-3 text-[11px] text-[#999] mb-1">
                    <span className="flex items-center gap-1"><Clock size={10} /> {visit.horaInicio}–{visit.horaFim}</span>
                    <span className="flex items-center gap-1"><MapPin size={10} /> {dealer?.cidade}, {dealer?.estado}</span>
                    {permissions.showConsultorColumn && <span>{consultor?.nome}</span>}
                  </div>
                  <p className="text-[12px] text-[#666] mb-2 line-clamp-2">{visit.objetivo}</p>
                  {visit.motivoDeclinado && (
                    <div className="text-[11px] text-[#c0002a] bg-[#FEF0F2] border border-[#f5b8c4] px-2 py-1 mb-2">
                      Motivo: {visit.motivoDeclinado}
                    </div>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    {permissions.canCreateRV && visit.status === "confirmado" && (
                      <Link
                        href={`/rv/novo?dealerId=${visit.dealerId}&consultorId=${visit.consultorId}`}
                        className="flex items-center gap-1 text-[11px] text-[#000] border border-[#000] px-2 py-1 hover:bg-[#f5f5f5] transition-colors rounded-sm font-medium"
                      >
                        <FileText size={10} /> Criar RV
                      </Link>
                    )}
                    {permissions.canAddToOutlook && visit.status !== "declinado" && (
                      <button
                        onClick={() => toast.info("Arquivo .ICS com lembrete de 24h gerado — disponível na versão com backend.")}
                        className="flex items-center gap-1 text-[11px] text-[#666] border border-[#E0E0E0] px-2 py-1 hover:bg-[#F5F5F5] transition-colors rounded-sm"
                      >
                        <Download size={10} /> Outlook
                      </button>
                    )}
                    {permissions.canDeclineVisit && visit.status === "pendente" && (
                      <button onClick={() => setShowDeclineModal(visit.id)} className="flex items-center gap-1 text-[11px] text-[#c0002a] border border-[#f5b8c4] px-2 py-1 hover:bg-[#FEF0F2] transition-colors rounded-sm">
                        <X size={10} /> Declinar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={showNewModal} onOpenChange={(o) => !isSaving && setShowNewModal(o)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#333] text-base font-semibold">Agendar visita</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Dealer *</label>
              <select className="bubble-input" value={newVisit.dealerId || ""} onChange={(e) => setNewVisit((p) => ({ ...p, dealerId: e.target.value }))}>
                <option value="">Selecione</option>
                {mockDealers.map((d) => <option key={d.id} value={d.id}>{d.nome} — {d.cidade}/{d.estado}</option>)}
              </select>
            </div>
            {currentUser.perfil !== "consultor" && (
              <div>
                <label className={labelClass}>Consultor *</label>
                <select className="bubble-input" value={newVisit.consultorId || ""} onChange={(e) => setNewVisit((p) => ({ ...p, consultorId: e.target.value }))}>
                  <option value="">Selecione</option>
                  {consultores.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className={labelClass}>Data *</label>
              <input type="date" className="bubble-input" value={newVisit.data || ""} onChange={(e) => setNewVisit((p) => ({ ...p, data: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClass}>Início</label>
                <input type="time" className="bubble-input" value={newVisit.horaInicio || ""} onChange={(e) => setNewVisit((p) => ({ ...p, horaInicio: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>Fim</label>
                <input type="time" className="bubble-input" value={newVisit.horaFim || ""} onChange={(e) => setNewVisit((p) => ({ ...p, horaFim: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Objetivo *</label>
              <textarea className="bubble-textarea min-h-[70px]" placeholder="Descreva o objetivo..." value={newVisit.objetivo || ""} onChange={(e) => setNewVisit((p) => ({ ...p, objetivo: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 4 }}>
            <button onClick={() => setShowNewModal(false)} disabled={isSaving} className="btn-secondary">Cancelar</button>
            <button onClick={handleCreate} disabled={isSaving} className="btn-primary" style={{ opacity: isSaving ? 0.7 : 1 }}>
              {isSaving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Calendar size={14} />} Agendar
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!showDeclineModal} onOpenChange={(o) => !isSaving && !o && setShowDeclineModal(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[#333] text-base font-semibold">Declinar visita</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-[12px] text-[#777]">Informe o motivo. Será comunicado ao consultor.</p>
            <div>
              <label className={labelClass}>Motivo *</label>
              <textarea className="bubble-textarea min-h-[70px]" placeholder="Motivo do declínio..." value={declineReason} onChange={(e) => setDeclineReason(e.target.value)} />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 4 }}>
            <button onClick={() => { setShowDeclineModal(null); setDeclineReason(""); }} disabled={isSaving} className="btn-secondary">Cancelar</button>
            <button
              onClick={() => showDeclineModal && handleDecline(showDeclineModal)}
              disabled={isSaving || !declineReason.trim()}
              className="btn-primary"
              style={{ opacity: !declineReason.trim() || isSaving ? 0.5 : 1, cursor: !declineReason.trim() || isSaving ? "not-allowed" : "pointer" }}
            >
              {isSaving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <XCircle size={14} />} Confirmar
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

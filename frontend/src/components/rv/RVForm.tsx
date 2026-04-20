"use client";

import React, { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RVReport } from "@/lib/types";
import { RVFormSection } from "./RVFormSection";
import { RVParticipantsField } from "./RVParticipantsField";
import { RVNextStepsTable } from "./RVNextStepsTable";
import { RVAttachmentsArea } from "./RVAttachmentsArea";
import { RVRelato } from "./RVRelato";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePermissions } from "@/hooks/usePermissions";
import { useRVContext } from "@/contexts/RVContext";
import { useAutoSave } from "@/hooks/useAutoSave";
import { mockDealers } from "@/lib/mocks/dealers";
import { getConsultores, getOperadoresByDealer, getGerentesByDealer } from "@/lib/mocks/users";
import { generateFakeToken, cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Save, Send, Loader2, Clock, Check } from "lucide-react";
import { toast } from "sonner";

const labelClass = "label";

interface RVFormProps {
  initialData?: RVReport;
  mode?: "create" | "edit";
}

export function RVForm({ initialData, mode = "create" }: RVFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser } = useCurrentUser();
  const permissions = usePermissions(currentUser);
  const { addRV, updateRV, focusOptions, modalityOptions } = useRVContext();
  const consultores = getConsultores();

  // Pré-preenchimento via query params (ex: vindo de "Criar RV" nos agendamentos)
  const prefillDealerId = searchParams?.get("dealerId") || "";
  const prefillConsultorId = searchParams?.get("consultorId") || "";

  const [formData, setFormData] = useState<Partial<RVReport>>(
    initialData || {
      dealerId: prefillDealerId,
      consultorId: prefillConsultorId || (currentUser.perfil === "consultor" ? currentUser.id : ""),
      dataVisita: new Date().toISOString().split("T")[0],
      horaInicio: "09:00",
      horaFim: "11:00",
      modalidade: "",
      foco: "",
      relato: "",
      pontosDestaque: "",
      avaliacaoConsultor: "",
      participantes: [],
      proximosPassos: [],
      anexos: [],
    }
  );

  const [showSendModal, setShowSendModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [selectedOperadorId, setSelectedOperadorId] = useState("");
  const [selectedGerentesIds, setSelectedGerentesIds] = useState<string[]>([]);

  const { status: autoSaveStatus, lastSaved } = useAutoSave(formData, initialData?.id || "new", 3000);

  const set = useCallback(<K extends keyof RVReport>(key: K, value: RVReport[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    await new Promise((r) => setTimeout(r, 800));
    if (mode === "create") {
      const newId = `rv_${Date.now()}`;
      const newRV: RVReport = { ...(formData as RVReport), id: newId, status: "rascunho", dataCriacao: new Date().toISOString() };
      addRV(newRV);
      toast.success("Rascunho salvo com sucesso!");
      router.push(`/rv/${newRV.id}`);
    } else if (initialData) {
      updateRV(initialData.id, { ...formData, status: "rascunho" });
      toast.success("Rascunho atualizado!");
      router.push(`/rv/${initialData.id}`);
    }
    setIsSavingDraft(false);
  };

  const validateBeforeSend = (): string | null => {
    if (!formData.dealerId) return "Selecione o dealer.";
    if (!formData.consultorId) return "Selecione o consultor.";
    if (!formData.dataVisita) return "Informe a data da visita.";
    if (!formData.modalidade) return "Selecione a modalidade.";
    if (!formData.foco) return "Selecione o foco da visita.";
    if (!formData.relato?.trim()) return "O relato da visita é obrigatório.";
    const dealerPs = (formData.participantes || []).filter((p) => p.tipo === "dealer");
    if (dealerPs.length === 0) return "Informe ao menos 1 participante do dealer.";
    if ((formData.proximosPassos || []).length === 0) return "Informe ao menos 1 próximo passo.";
    if (!selectedOperadorId) return "Selecione o Operador destinatário (obrigatório).";
    return null;
  };

  const handleSend = async () => {
    const err = validateBeforeSend();
    if (err) { toast.error(err); return; }
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    if (mode === "create") {
      const sendId = `rv_${Date.now()}`;
      const newRV: RVReport = {
        ...(formData as RVReport),
        id: sendId,
        status: "enviado",
        dataCriacao: new Date().toISOString(),
        dataEnvio: new Date().toISOString(),
        tokenCiencia: generateFakeToken(),
        operadorId: selectedOperadorId,
        gerentesIds: selectedGerentesIds,
      };
      addRV(newRV);
      toast.success("Relatório enviado! O dealer receberá o link de ciência.");
      router.push(`/rv/${newRV.id}`);
    } else if (initialData) {
      updateRV(initialData.id, {
        ...formData,
        status: "enviado",
        dataEnvio: new Date().toISOString(),
        tokenCiencia: initialData.tokenCiencia || generateFakeToken(),
        operadorId: selectedOperadorId,
        gerentesIds: selectedGerentesIds,
      });
      toast.success("Relatório enviado com sucesso!");
      router.push(`/rv/${initialData.id}`);
    }
    setIsSending(false);
    setShowSendModal(false);
  };

  return (
    <>
      <div className="pb-20">
        {/* Section 1: Cabeçalho */}
        <RVFormSection title="Informações da visita" description="Dados gerais do relatório">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Dealer *</label>
              <select className="bubble-input" value={formData.dealerId || ""} onChange={(e) => set("dealerId", e.target.value)}>
                <option value="">Selecione o dealer</option>
                {mockDealers.map((d) => <option key={d.id} value={d.id}>{d.nome} — {d.cidade}/{d.estado}</option>)}
              </select>
            </div>

            <div>
              <label className={labelClass}>Consultor *</label>
              <select className="bubble-input" value={formData.consultorId || ""} onChange={(e) => set("consultorId", e.target.value)} disabled={currentUser.perfil === "consultor"}>
                <option value="">Selecione o consultor</option>
                {consultores.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>

            <div>
              <label className={labelClass}>Data da visita *</label>
              <input type="date" className="bubble-input" value={formData.dataVisita || ""} onChange={(e) => set("dataVisita", e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClass}>Início</label>
                <input type="time" className="bubble-input" value={formData.horaInicio || ""} onChange={(e) => set("horaInicio", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Fim</label>
                <input type="time" className="bubble-input" value={formData.horaFim || ""} onChange={(e) => set("horaFim", e.target.value)} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Modalidade *</label>
              <select className="bubble-input" value={formData.modalidade || ""} onChange={(e) => set("modalidade", e.target.value)}>
                <option value="">Selecione</option>
                {modalityOptions.filter((o) => o.ativo).map((o) => <option key={o.id} value={o.label}>{o.label}</option>)}
              </select>
            </div>

            <div>
              <label className={labelClass}>Foco da visita *</label>
              <select className="bubble-input" value={formData.foco || ""} onChange={(e) => set("foco", e.target.value)}>
                <option value="">Selecione</option>
                {focusOptions.filter((o) => o.ativo).map((o) => <option key={o.id} value={o.label}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </RVFormSection>

        {/* Section 2: Participantes */}
        <RVFormSection title="Participantes do dealer" description="Presentes na visita pelo lado do dealer">
          <RVParticipantsField
            participants={(formData.participantes || []).filter((p) => p.tipo === "dealer")}
            onChange={(updated) => {
              const consultorPs = (formData.participantes || []).filter((p) => p.tipo === "consultor");
              set("participantes", [...consultorPs, ...updated]);
            }}
          />
        </RVFormSection>

        {/* Section 3: Relato */}
        <RVFormSection title="Relato da visita" description="O que foi discutido, observado e acordado">
          <RVRelato label="Relato" value={formData.relato || ""} onChange={(v) => set("relato", v)} placeholder="Descreva o relato..." rows={9} showAI />
        </RVFormSection>

        {/* Section 4: Destaques */}
        <RVFormSection title="Pontos de destaque" description="Principais observações e pontos críticos">
          <RVRelato label="Destaques" value={formData.pontosDestaque || ""} onChange={(v) => set("pontosDestaque", v)} placeholder="Liste os pontos de destaque..." rows={4} showAI={false} />
        </RVFormSection>

        {/* Section 5: Próximos passos */}
        <RVFormSection title="Próximos passos" description="Ações acordadas com responsáveis e prazos">
          <RVNextStepsTable steps={formData.proximosPassos || []} onChange={(steps) => set("proximosPassos", steps)} />
        </RVFormSection>

        {/* Section 6: Avaliação — oculto para dealer */}
        {permissions.canViewAvaliacaoConsultor && (
          <RVFormSection title="Avaliação do consultor" description="Uso interno — não exibido para o dealer">
            <div className="mb-2 flex items-center gap-1.5 bg-[#FFFBEB] border border-[#FDE68A] px-2.5 py-1.5 text-[11px] text-[#92400E]">
              Uso interno — não visível para o dealer.
            </div>
            <RVRelato label="Avaliação" value={formData.avaliacaoConsultor || ""} onChange={(v) => set("avaliacaoConsultor", v)} placeholder="Avaliação interna sobre o dealer..." rows={4} showAI={false} />
          </RVFormSection>
        )}

        {/* Section 7: Anexos */}
        <RVFormSection title="Anexos" description="Documentos, fotos e arquivos">
          <RVAttachmentsArea attachments={formData.anexos || []} onChange={(atts) => set("anexos", atts)} />
        </RVFormSection>
      </div>

      {/* Sticky footer */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #eeeeee", zIndex: 20, padding: "12px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9e9e9e" }}>
            {autoSaveStatus === "saving" && <><Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> Salvando...</>}
            {autoSaveStatus === "saved" && lastSaved && <><Check size={12} style={{ color: "#3d8b2e" }} /> Salvo às {lastSaved.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</>}
            {autoSaveStatus === "idle" && <><Clock size={12} style={{ color: "#e0e0e0" }} /> <span style={{ color: "#e0e0e0" }}>Sem alterações</span></>}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <button
              onClick={handleSaveDraft}
              disabled={isSavingDraft}
              className={cn("btn-secondary", isSavingDraft && "cursor-wait")}
              style={{ opacity: isSavingDraft ? 0.6 : 1 }}
            >
              {isSavingDraft ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={14} />}
              <span className="hidden sm:inline">Salvar rascunho</span>
            </button>

            <button onClick={() => setShowSendModal(true)} className="btn-primary">
              <Send size={14} /> Enviar RV
            </button>
          </div>
        </div>
      </div>

      {/* Send modal */}
      <Dialog open={showSendModal} onOpenChange={(o) => !isSending && setShowSendModal(o)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#333] text-base font-semibold">Confirmar envio do RV</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-1">
            {/* Resumo */}
            <div className="border border-[#E8E8E8] bg-[#FAFAFA] p-3 space-y-1.5 text-[13px]">
              {formData.dealerId && (
                <div className="flex gap-2">
                  <span className="text-[#999] w-20 flex-none">Dealer</span>
                  <span className="text-[#333]">{mockDealers.find((d) => d.id === formData.dealerId)?.nome}</span>
                </div>
              )}
              {formData.dataVisita && (
                <div className="flex gap-2">
                  <span className="text-[#999] w-20 flex-none">Data</span>
                  <span className="text-[#333]">{new Date(formData.dataVisita + "T12:00:00").toLocaleDateString("pt-BR")}</span>
                </div>
              )}
              {formData.foco && (
                <div className="flex gap-2">
                  <span className="text-[#999] w-20 flex-none">Foco</span>
                  <span className="text-[#333]">{formData.foco}</span>
                </div>
              )}
            </div>

            {/* Destinatários */}
            <div className="border border-[#E8E8E8]">
              <div className="bg-[#F7F7F7] border-b border-[#EFEFEF] px-3 py-2">
                <p className="text-[10px] font-semibold text-[#888] uppercase tracking-wide">Destinatários</p>
              </div>
              <div className="p-3 space-y-3">
                {/* Operador — obrigatório */}
                <div>
                  <label className="block text-[10px] font-semibold text-[#999] uppercase tracking-wide mb-1">
                    Operador (obrigatório) *
                  </label>
                  <select
                    className="bubble-input"
                    value={selectedOperadorId}
                    onChange={(e) => setSelectedOperadorId(e.target.value)}
                  >
                    <option value="">Selecione o operador responsável</option>
                    {getOperadoresByDealer(formData.dealerId || "").map((op) => (
                      <option key={op.id} value={op.id}>{op.nome}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-[#bbb] mt-0.5">Receberá o link de ciência para assinatura.</p>
                </div>

                {/* Gerentes — opcional */}
                <div>
                  <label className="block text-[10px] font-semibold text-[#999] uppercase tracking-wide mb-1">
                    Gerentes do Dealer (opcional)
                  </label>
                  <div className="space-y-1">
                    {getGerentesByDealer(formData.dealerId || "").length === 0
                      ? <p className="text-[11px] text-[#ccc] italic">Nenhum gerente cadastrado para este dealer.</p>
                      : getGerentesByDealer(formData.dealerId || "").map((g) => (
                        <label key={g.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedGerentesIds.includes(g.id)}
                            onChange={(e) => {
                              setSelectedGerentesIds(prev =>
                                e.target.checked ? [...prev, g.id] : prev.filter(id => id !== g.id)
                              );
                            }}
                            className="w-3.5 h-3.5 accent-[#D80030] rounded-sm"
                          />
                          <span className="text-[12px] text-[#444]">{g.nome}</span>
                          <span className="text-[10px] text-[#bbb]">— cópia apenas</span>
                        </label>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#999] border-l-2 border-[#E0E0E0] pl-2">
              Após confirmar, o dealer receberá o link de ciência por e-mail. O RV poderá ser editado enquanto não for assinado.
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 4 }}>
            <button onClick={() => setShowSendModal(false)} disabled={isSending} className="btn-secondary">
              Cancelar
            </button>
            <button
              onClick={handleSend}
              disabled={isSending}
              className="btn-primary"
              style={{ opacity: isSending ? 0.7 : 1, cursor: isSending ? "wait" : "pointer" }}
            >
              {isSending ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Enviando...</> : <><Send size={14} /> Confirmar envio</>}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

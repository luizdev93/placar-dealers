"use client";

import React, { useState, Suspense } from "react";
import { useParams } from "next/navigation";
import {
  CheckCircle2, ChevronRight, Clock, FileText, Users,
  ClipboardList, Paperclip, AlertCircle, Loader2,
} from "lucide-react";
import { CurrentUserProvider } from "@/contexts/CurrentUserContext";
import { RVProvider } from "@/contexts/RVContext";
import { useRVContext } from "@/contexts/RVContext";
import { getMockDealerById } from "@/lib/mocks/dealers";
import { getMockUserById } from "@/lib/mocks/users";
import { formatDate, formatDateTime, generateFakeHash, cn } from "@/lib/utils";
import { RVNextStepsTable } from "@/components/rv/RVNextStepsTable";

function CienciaContent() {
  const params = useParams();
  const token = params.token as string;

  const { rvReports, signatureSessions, updateSignatureSession, updateRV } = useRVContext();

  const session = signatureSessions.find((s) => s.token === token);
  const rv = session ? rvReports.find((r) => r.id === session.rvId) : null;
  const dealer = rv ? getMockDealerById(rv.dealerId) : null;
  const operador = session ? getMockUserById(session.operadorId) : null;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [comentario, setComentario] = useState("");
  const [checked, setChecked] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [hash, setHash] = useState("");
  const [signedAt, setSignedAt] = useState("");

  /* ── token inválido ── */
  if (!session) {
    return (
      <div className="min-h-0 w-full bg-white flex items-center justify-center p-5 py-16">
        <div className="max-w-sm w-full text-center">
          <AlertCircle size={32} className="text-[#D80030] mx-auto mb-3" />
          <h1 className="text-base font-semibold text-[#333] mb-1">Link inválido ou expirado</h1>
          <p className="text-[13px] text-[#888]">
            Este link de ciência não é válido ou já expirou. Entre em contato com seu consultor.
          </p>
        </div>
      </div>
    );
  }

  /* ── já assinado ── */
  if (session.status === "assinado") {
    return (
      <div className="min-h-0 w-full bg-white flex items-center justify-center p-5 py-16">
        <div className="max-w-sm w-full">
          <div className="text-center mb-4">
            <div className="w-14 h-14 bg-[#EDFAE9] border border-[#C6EFC0] flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={28} className="text-[#3d8b2e]" />
            </div>
            <h1 className="text-base font-semibold text-[#333] mb-1">Ciência já confirmada</h1>
            <p className="text-[13px] text-[#888]">Este relatório já foi assinado anteriormente.</p>
          </div>
          <div className="border border-[#E8E8E8] bg-[#FAFAFA] p-3 space-y-2 text-[13px]">
            <div>
              <p className="text-[10px] text-[#aaa] uppercase font-semibold tracking-wide">Data da assinatura</p>
              <p className="text-[#333] font-medium mt-0.5">{session.dataAssinatura ? formatDateTime(session.dataAssinatura) : "—"}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#aaa] uppercase font-semibold tracking-wide">Código de verificação</p>
              <p className="text-[#3d8b2e] font-mono text-[11px] mt-0.5 break-all">{session.hashFake || "—"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!rv || !dealer) {
    return (
      <div className="min-h-0 w-full bg-white flex items-center justify-center p-5 py-16">
        <div className="max-w-sm w-full text-center">
          <AlertCircle size={32} className="text-[#888] mx-auto mb-3" />
          <h1 className="text-base font-semibold text-[#333] mb-1">Relatório não encontrado</h1>
          <p className="text-[13px] text-[#888]">Não foi possível carregar o relatório.</p>
        </div>
      </div>
    );
  }

  const handleSign = async () => {
    setIsSigning(true);
    await new Promise((r) => setTimeout(r, 1500));
    const generatedHash = generateFakeHash(rv.id);
    const now = new Date().toISOString();
    setHash(generatedHash);
    setSignedAt(now);
    updateSignatureSession(token, { status: "assinado", dataAssinatura: now, hashFake: generatedHash, comentario: comentario || undefined });
    updateRV(rv.id, { status: "assinado", dataAssinatura: now, comentarioCiencia: comentario || undefined });
    setIsSigning(false);
    setStep(3);
  };

  return (
    <div className="min-h-0 w-full bg-white flex flex-col">
      {/* Stepper compacto */}
      {step < 3 && (
        <div className="border-b border-[#EBEBEB] px-4 py-2 flex-none bg-[#FAFAFA]">
          <div className="max-w-lg mx-auto flex items-center gap-2">
            {[1, 2].map((s) => (
              <React.Fragment key={s}>
                <div className={cn("w-5 h-5 flex items-center justify-center text-[10px] font-bold flex-none rounded-sm", step >= s ? "bg-[#D80030] text-white" : "bg-[#E8E8E8] text-[#aaa]")}>
                  {s}
                </div>
                <span className={cn("text-[11px]", step >= s ? "text-[#D80030] font-medium" : "text-[#ccc]")}>
                  {s === 1 ? "Identificação" : "Leitura e confirmação"}
                </span>
                {s < 2 && <div className="flex-1 h-px bg-[#E8E8E8]" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-5 pb-28">

          {/* ── Step 1: Identificação ── */}
          {step === 1 && (
            <div className="space-y-3">
              <div className="border border-[#E8E8E8] p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#FEF0F2] border border-[#f5b8c4] flex items-center justify-center flex-none">
                    <span className="text-[#D80030] font-bold text-sm">{operador?.avatarInitials || "?"}</span>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#aaa]">Você está assinando como</p>
                    <p className="text-[15px] font-semibold text-[#333] leading-tight">{operador?.nome || "Operador"}</p>
                  </div>
                </div>

                <div className="space-y-0 mb-4">
                  {[
                    ["Dealer", dealer.nome],
                    ["Relatório", rv.id.toUpperCase()],
                    ["Data da visita", formatDate(rv.dataVisita)],
                    ["Foco", rv.foco],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between py-2 border-b border-[#F5F5F5] last:border-0">
                      <span className="text-[12px] text-[#aaa]">{label}</span>
                      <span className="text-[12px] font-medium text-[#333] text-right max-w-[60%]">{value}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full flex items-center justify-center gap-2 bg-[#D80030] text-white font-semibold text-[14px] py-3.5 hover:bg-[#B5022A] transition-colors"
                >
                  Continuar para o relatório <ChevronRight size={16} />
                </button>
              </div>

              <div className="border border-[#E8E8E8] bg-[#FAFAFA] px-3 py-2.5">
                <p className="text-[12px] text-[#777]">
                  <strong>O que é isto?</strong> Relatório de visita elaborado pelo seu consultor. Após a leitura, confirme sua ciência.
                </p>
              </div>
            </div>
          )}

          {/* ── Step 2: Leitura e confirmação ── */}
          {step === 2 && (
            <div className="space-y-3">
              {/* Infos gerais */}
              <div className="border border-[#E8E8E8]">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-[#EFEFEF] bg-[#F9F9F9]">
                  <FileText size={12} className="text-[#ccc]" />
                  <span className="text-[10px] font-semibold text-[#555] uppercase tracking-wide">Informações gerais</span>
                </div>
                <div className="p-3 space-y-0">
                  {[["Data", formatDate(rv.dataVisita)], ["Horário", `${rv.horaInicio} – ${rv.horaFim}`], ["Modalidade", rv.modalidade], ["Foco", rv.foco]].map(([label, value]) => (
                    <div key={label} className="flex gap-3 py-1.5 border-b border-[#F8F8F8] last:border-0">
                      <span className="text-[11px] text-[#aaa] w-24 flex-none">{label}</span>
                      <span className="text-[13px] text-[#333] font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {rv.participantes.length > 0 && (
                <div className="border border-[#E8E8E8]">
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-[#EFEFEF] bg-[#F9F9F9]">
                    <Users size={12} className="text-[#ccc]" />
                    <span className="text-[10px] font-semibold text-[#555] uppercase tracking-wide">Participantes</span>
                  </div>
                  <div className="p-3 space-y-1">
                    {rv.participantes.map((p) => (
                      <div key={p.id} className="text-[13px]">
                        <span className="font-medium text-[#333]">{p.nome}</span>
                        <span className="text-[#aaa]"> — {p.cargo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {rv.relato && (
                <div className="border border-[#E8E8E8]">
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-[#EFEFEF] bg-[#F9F9F9]">
                    <FileText size={12} className="text-[#ccc]" />
                    <span className="text-[10px] font-semibold text-[#555] uppercase tracking-wide">Relato</span>
                  </div>
                  <p className="p-3 text-[13px] text-[#444] leading-relaxed whitespace-pre-wrap">{rv.relato}</p>
                </div>
              )}

              {rv.pontosDestaque && (
                <div className="border border-[#E8E8E8]">
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-[#EFEFEF] bg-[#F9F9F9]">
                    <ClipboardList size={12} className="text-[#ccc]" />
                    <span className="text-[10px] font-semibold text-[#555] uppercase tracking-wide">Pontos de destaque</span>
                  </div>
                  <p className="p-3 text-[13px] text-[#444] leading-relaxed whitespace-pre-wrap">{rv.pontosDestaque}</p>
                </div>
              )}

              {rv.proximosPassos.length > 0 && (
                <div className="border border-[#E8E8E8]">
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-[#EFEFEF] bg-[#F9F9F9]">
                    <ClipboardList size={12} className="text-[#ccc]" />
                    <span className="text-[10px] font-semibold text-[#555] uppercase tracking-wide">Próximos passos</span>
                  </div>
                  <div className="p-3">
                    <RVNextStepsTable steps={rv.proximosPassos} onChange={() => {}} readonly />
                  </div>
                </div>
              )}

              {rv.anexos.length > 0 && (
                <div className="border border-[#E8E8E8]">
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-[#EFEFEF] bg-[#F9F9F9]">
                    <Paperclip size={12} className="text-[#ccc]" />
                    <span className="text-[10px] font-semibold text-[#555] uppercase tracking-wide">Anexos</span>
                  </div>
                  <div className="p-3 space-y-1">
                    {rv.anexos.map((att) => (
                      <div key={att.id} className="flex items-center gap-2 text-[13px]">
                        <Paperclip size={11} className="text-[#ccc]" />
                        <span className="text-[#444]">{att.nome}</span>
                        <span className="text-[#ccc] text-[11px]">{att.tamanho}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comentário */}
              <div className="border border-[#E8E8E8]">
                <div className="px-3 py-2 border-b border-[#EFEFEF] bg-[#F9F9F9] flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-[#555] uppercase tracking-wide">Comentário (opcional)</span>
                  <span className={`text-[10px] ${comentario.length > 480 ? "text-[#D80030]" : "text-[#ccc]"}`}>{comentario.length}/500</span>
                </div>
                <div className="p-3">
                  <textarea
                    className="w-full border border-[#E0E0E0] px-3 py-2 text-[#333] resize-none focus:outline-none focus:border-[#aaa] transition-colors min-h-[72px]"
                    placeholder="Adicione um comentário se desejar..."
                    maxLength={500}
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    style={{ fontSize: "16px" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Sucesso ── */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="border border-[#E8E8E8] p-5 text-center">
                <div className="w-14 h-14 bg-[#EDFAE9] border border-[#C6EFC0] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={28} className="text-[#3d8b2e]" />
                </div>
                <h1 className="text-[15px] font-semibold text-[#333] mb-1">Ciência confirmada!</h1>
                <p className="text-[12px] text-[#888] mb-4">Sua confirmação foi registrada. Guarde os dados abaixo.</p>

                <div className="border border-[#E8E8E8] bg-[#FAFAFA] p-3 text-left space-y-2.5">
                  <div>
                    <p className="text-[10px] text-[#aaa] uppercase font-semibold tracking-wide">Data e hora</p>
                    <p className="text-[13px] font-medium text-[#333] mt-0.5 flex items-center gap-1.5">
                      <Clock size={11} className="text-[#3d8b2e]" /> {signedAt ? formatDateTime(signedAt) : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#aaa] uppercase font-semibold tracking-wide">Assinado por</p>
                    <p className="text-[13px] font-medium text-[#333] mt-0.5">{operador?.nome || "—"}</p>
                    {operador?.cargo && (
                      <p className="text-[11px] text-[#888] mt-0.5">{operador.cargo}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] text-[#aaa] uppercase font-semibold tracking-wide">Dealer</p>
                    <p className="text-[13px] font-medium text-[#333] mt-0.5">{dealer.nome}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#aaa] uppercase font-semibold tracking-wide">Código de verificação</p>
                    <p className="text-[11px] font-mono text-[#3d8b2e] mt-0.5 break-all bg-[#EDFAE9] border border-[#C6EFC0] px-2 py-1">{hash}</p>
                  </div>
                  {comentario && (
                    <div>
                      <p className="text-[10px] text-[#aaa] uppercase font-semibold tracking-wide">Comentário</p>
                      <p className="text-[12px] text-[#555] mt-0.5 italic">&quot;{comentario}&quot;</p>
                    </div>
                  )}
                  <div className="border-t border-[#EBEBEB] pt-2 space-y-0.5">
                    <p className="text-[10px] text-[#ccc] uppercase font-semibold tracking-wide">Metadados</p>
                    <p className="text-[10px] text-[#ccc] font-mono">IP: 187.x.x.x (simulado)</p>
                    <p className="text-[10px] text-[#ccc] font-mono truncate">
                      UA: {typeof window !== "undefined" ? window.navigator.userAgent.substring(0, 60) + "…" : "Mobile Browser"}
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-[#ccc] mt-3">Registrado no sistema com trilha de auditoria.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Sticky footer — step 2 */}
      {step === 2 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#EBEBEB] p-4 z-10">
          <div className="max-w-lg mx-auto space-y-2.5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="mt-0.5 w-5 h-5 accent-[#D80030] cursor-pointer flex-none"
              />
              <span className="text-[13px] text-[#444] leading-snug" style={{ fontSize: "16px" }}>
                Li o relatório e estou ciente do conteúdo apresentado.
              </span>
            </label>

            <button
              onClick={handleSign}
              disabled={!checked || isSigning}
              className={cn(
                "w-full flex items-center justify-center gap-2 font-semibold text-[15px] py-3.5 transition-colors",
                !checked || isSigning ? "bg-[#E0E0E0] text-[#aaa] cursor-not-allowed" : "bg-[#D80030] text-white hover:bg-[#B5022A]"
              )}
            >
              {isSigning ? <><Loader2 size={16} className="animate-spin" /> Confirmando...</> : <><CheckCircle2 size={16} /> Confirmar ciência</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CienciaPage() {
  return (
    <CurrentUserProvider>
      <RVProvider>
        <Suspense fallback={null}>
          <CienciaContent />
        </Suspense>
      </RVProvider>
    </CurrentUserProvider>
  );
}

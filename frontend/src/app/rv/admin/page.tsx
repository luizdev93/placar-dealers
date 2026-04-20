"use client";

import React, { useState } from "react";
import { Plus, Pencil, Check, X, ToggleLeft, ToggleRight, Download } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { RVTable } from "@/components/rv/RVTable";
import { RVFilters } from "@/components/rv/RVFilters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePermissions } from "@/hooks/usePermissions";
import { useRVContext } from "@/contexts/RVContext";
import { useRVList } from "@/hooks/useRVList";
import { DomainOption } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { mockUsers } from "@/lib/mocks/users";

function DomainTable({ options, onUpdate, onAdd }: { options: DomainOption[]; onUpdate: (id: string, u: Partial<DomainOption>) => void; onAdd: (label: string) => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");

  const saveEdit = (id: string) => {
    if (!editValue.trim()) { toast.error("Nome não pode ser vazio."); return; }
    onUpdate(id, { label: editValue.trim() });
    setEditingId(null); setEditValue("");
    toast.success("Atualizado.");
  };

  const doAdd = () => {
    if (!newLabel.trim()) { toast.error("Informe o nome."); return; }
    onAdd(newLabel.trim());
    setNewLabel(""); setIsAdding(false);
    toast.success("Item adicionado.");
  };

  return (
    <div className="bg-white border border-[#E8E8E8]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#EFEFEF] bg-[#F9F9F9]">
        <span className="text-[10px] font-semibold text-[#888] uppercase tracking-wide">{options.length} iten{options.length !== 1 ? "s" : ""}</span>
        {!isAdding && (
          <button onClick={() => { setIsAdding(true); setEditingId(null); }} className="flex items-center gap-1 px-2 py-1 bg-[#D80030] text-white text-[11px] font-medium hover:bg-[#B5022A] transition-colors rounded-sm">
            <Plus size={11} /> Adicionar
          </button>
        )}
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#F0F0F0]">
            <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-[#999] uppercase tracking-wide">Nome</th>
            <th className="px-3 py-1.5 text-center text-[10px] font-semibold text-[#999] uppercase tracking-wide w-24">Status</th>
            <th className="px-3 py-1.5 text-right text-[10px] font-semibold text-[#999] uppercase tracking-wide w-20">Ações</th>
          </tr>
        </thead>
        <tbody>
          {isAdding && (
            <tr className="border-b border-[#F5F5F5] bg-[#FFFBFB]">
              <td className="px-3 py-1.5">
                <input autoFocus className="bubble-input" placeholder="Nome do item..." value={newLabel} onChange={(e) => setNewLabel(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") doAdd(); if (e.key === "Escape") setIsAdding(false); }} />
              </td>
              <td />
              <td className="px-3 py-1.5 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button onClick={doAdd} className="p-1 text-[#3d8b2e] hover:bg-[#EDFAE9] rounded-sm"><Check size={13} /></button>
                  <button onClick={() => { setIsAdding(false); setNewLabel(""); }} className="p-1 text-[#aaa] hover:bg-[#F5F5F5] rounded-sm"><X size={13} /></button>
                </div>
              </td>
            </tr>
          )}
          {options.map((opt) => (
            <tr key={opt.id} className={cn("border-b border-[#F5F5F5] last:border-0 hover:bg-[#FAFAFA] transition-colors", !opt.ativo && "opacity-50")}>
              <td className="px-3 py-1.5">
                {editingId === opt.id
                  ? <input autoFocus className="bubble-input" value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveEdit(opt.id); if (e.key === "Escape") setEditingId(null); }} />
                  : <span className="text-[13px] text-[#333]">{opt.label}</span>}
              </td>
              <td className="px-3 py-1.5 text-center">
                <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-sm", opt.ativo ? "bg-[#EDFAE9] text-[#3d8b2e]" : "bg-[#F2F2F2] text-[#999]")}>
                  {opt.ativo ? "Ativo" : "Inativo"}
                </span>
              </td>
              <td className="px-3 py-1.5 text-right">
                <div className="flex items-center justify-end gap-0.5">
                  {editingId === opt.id ? (
                    <>
                      <button onClick={() => saveEdit(opt.id)} className="p-1 text-[#3d8b2e] hover:bg-[#EDFAE9] rounded-sm"><Check size={13} /></button>
                      <button onClick={() => setEditingId(null)} className="p-1 text-[#aaa] hover:bg-[#F5F5F5] rounded-sm"><X size={13} /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setEditingId(opt.id); setEditValue(opt.label); setIsAdding(false); }} className="p-1 text-[#bbb] hover:text-[#555] rounded-sm"><Pencil size={13} /></button>
                      <button onClick={() => { onUpdate(opt.id, { ativo: !opt.ativo }); toast.success(opt.ativo ? "Desativado." : "Ativado."); }} className={cn("p-1 rounded-sm", opt.ativo ? "text-[#3d8b2e] hover:bg-[#EDFAE9]" : "text-[#bbb] hover:bg-[#F5F5F5]")}>
                        {opt.ativo ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminPage() {
  const { currentUser } = useCurrentUser();
  const permissions = usePermissions(currentUser);
  const { focusOptions, setFocusOptions, modalityOptions, setModalityOptions, rvReports: allRVReports } = useRVContext();
  const { rvReports, filters, updateFilter, clearFilters, isLoading } = useRVList();

  // ── Estatísticas calculadas a partir do conjunto completo de RVs ──
  const statsTotal = allRVReports.length;
  const statsAssinados = allRVReports.filter((r) => r.status === "assinado").length;
  const statsPendentes = allRVReports.filter((r) => ["enviado", "lembrete1", "lembrete2"].includes(r.status)).length;
  const taxaGeral = statsTotal > 0 ? Math.round((statsAssinados / statsTotal) * 100) : 0;

  const consultores = mockUsers.filter((u) => u.perfil === "consultor");
  const taxaPorConsultor = consultores.map((c) => {
    const rvsc = allRVReports.filter((r) => r.consultorId === c.id);
    const enviados = rvsc.filter((r) => ["enviado", "lembrete1", "lembrete2", "assinado", "expirado"].includes(r.status)).length;
    const ass = rvsc.filter((r) => r.status === "assinado").length;
    const taxa = enviados > 0 ? Math.round((ass / enviados) * 100) : 0;
    return { nome: c.nome, enviados, assinados: ass, taxa };
  });

  if (!permissions.canAccessAdmin) {
    return (
      <div className="py-12 text-center">
        <p className="text-[#888] text-sm">Apenas administradores têm acesso.</p>
      </div>
    );
  }

  const updFocus = (id: string, u: Partial<DomainOption>) => setFocusOptions((prev) => prev.map((o) => o.id === id ? { ...o, ...u } : o));
  const addFocus = (label: string) => setFocusOptions((prev) => [...prev, { id: `foco_${Date.now()}`, label, ativo: true }]);
  const updModality = (id: string, u: Partial<DomainOption>) => setModalityOptions((prev) => prev.map((o) => o.id === id ? { ...o, ...u } : o));
  const addModality = (label: string) => setModalityOptions((prev) => [...prev, { id: `mod_${Date.now()}`, label, ativo: true }]);

  return (
    <>
      <PageHeader title="Administração" subtitle="Visão global e gestão de domínios" />

      <Tabs defaultValue="rvs">
        <TabsList className="mb-3 bg-white border border-[#E8E8E8] rounded-sm p-0.5 h-auto gap-0.5">
          <TabsTrigger value="rvs" className="rounded-sm text-[12px] px-3 py-1.5 data-[state=active]:bg-[#D80030] data-[state=active]:text-white data-[state=inactive]:text-[#666]">
            Todos os RVs
          </TabsTrigger>
          <TabsTrigger value="focos" className="rounded-sm text-[12px] px-3 py-1.5 data-[state=active]:bg-[#D80030] data-[state=active]:text-white data-[state=inactive]:text-[#666]">
            Focos
          </TabsTrigger>
          <TabsTrigger value="modalidades" className="rounded-sm text-[12px] px-3 py-1.5 data-[state=active]:bg-[#D80030] data-[state=active]:text-white data-[state=inactive]:text-[#666]">
            Modalidades
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rvs">
          {/* ── Stat cards ── */}
          <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
            {[
              { label: "Total de RVs", value: statsTotal, color: "#000" },
              { label: "Assinados", value: `${statsAssinados} (${taxaGeral}%)`, color: "#3d8b2e" },
              { label: "Pendentes de ciência", value: statsPendentes, color: "#b88800" },
            ].map((card) => (
              <div key={card.label} className="bubble-card" style={{ flex: "1 1 160px", padding: "16px 20px", minWidth: 140 }}>
                <p style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>{card.label}</p>
                <p style={{ fontSize: 28, fontWeight: 900, color: card.color, lineHeight: 1 }}>{card.value}</p>
              </div>
            ))}
          </div>

          {/* ── Taxa por consultor ── */}
          <div className="bubble-card" style={{ marginBottom: 20, padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #f0f0f0", background: "#fafafa" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#252525" }}>Taxa de ciência por consultor</p>
              <p style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>Meta: ≥ 70% — abaixo da meta destacado em vermelho</p>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #eeeeee", background: "#fafafa" }}>
                  {["Consultor", "Enviados", "Assinados", "Taxa de ciência"].map((h) => (
                    <th key={h} style={{ padding: "8px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#888" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {taxaPorConsultor.map((row) => {
                  const abaixo = row.taxa < 70 && row.enviados > 0;
                  return (
                    <tr key={row.nome} style={{ borderBottom: "1px solid #f5f5f5" }}>
                      <td style={{ padding: "8px 16px", fontSize: 13, color: "#252525", fontWeight: 500 }}>{row.nome}</td>
                      <td style={{ padding: "8px 16px", fontSize: 13, color: "#252525" }}>{row.enviados}</td>
                      <td style={{ padding: "8px 16px", fontSize: 13, color: "#3d8b2e", fontWeight: 500 }}>{row.assinados}</td>
                      <td style={{ padding: "8px 16px" }}>
                        <span style={{
                          fontSize: 13, fontWeight: 700,
                          color: abaixo ? "#c0002a" : "#3d8b2e",
                          background: abaixo ? "#FEF0F2" : "#EDFAE9",
                          borderRadius: 6, padding: "2px 8px",
                        }}>
                          {row.enviados === 0 ? "—" : `${row.taxa}%`}
                        </span>
                        {abaixo && (
                          <span style={{ fontSize: 10, color: "#c0002a", marginLeft: 6 }}>abaixo da meta</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <RVFilters filters={filters} onFilterChange={updateFilter} onClear={clearFilters} showConsultorFilter showRegiaoFilter />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-[#aaa]">{rvReports.length} registro{rvReports.length !== 1 ? "s" : ""}</span>
            <div className="flex gap-2">
              <button onClick={() => toast.info("Exportação XLSX — disponível na versão com backend.")} className="flex items-center gap-1 px-2.5 py-1 border border-[#E0E0E0] text-[11px] text-[#666] hover:bg-[#F5F5F5] rounded-sm transition-colors">
                <Download size={11} /> XLSX
              </button>
              <button onClick={() => toast.info("Exportação PDF — disponível na versão com backend.")} className="flex items-center gap-1 px-2.5 py-1 border border-[#E0E0E0] text-[11px] text-[#666] hover:bg-[#F5F5F5] rounded-sm transition-colors">
                <Download size={11} /> PDF
              </button>
            </div>
          </div>
          <RVTable rvReports={rvReports} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="focos">
          <div className="mb-3">
            <p className="text-sm font-medium text-[#333]">Focos da visita</p>
            <p className="text-[12px] text-[#aaa]">Opções disponíveis no formulário de RV.</p>
          </div>
          <DomainTable options={focusOptions} onUpdate={updFocus} onAdd={addFocus} />
        </TabsContent>

        <TabsContent value="modalidades">
          <div className="mb-3">
            <p className="text-sm font-medium text-[#333]">Modalidades</p>
            <p className="text-[12px] text-[#aaa]">Opções disponíveis no formulário de RV.</p>
          </div>
          <DomainTable options={modalityOptions} onUpdate={updModality} onAdd={addModality} />
        </TabsContent>
      </Tabs>
    </>
  );
}

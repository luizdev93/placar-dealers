"use client";

import React from "react";
import { NextStep } from "@/lib/types";
import { Plus, Trash2, Check } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface RVNextStepsTableProps {
  steps: NextStep[];
  onChange: (steps: NextStep[]) => void;
  readonly?: boolean;
}

export function RVNextStepsTable({ steps, onChange, readonly = false }: RVNextStepsTableProps) {
  const addStep = () => {
    onChange([...steps, { id: `ns_${Date.now()}`, descricao: "", responsavel: "", prazo: "", concluido: false }]);
  };

  const updateStep = (id: string, field: keyof NextStep, value: string | boolean) => {
    onChange(steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const removeStep = (id: string) => {
    onChange(steps.filter((s) => s.id !== id));
  };

  if (readonly) {
    if (steps.length === 0) return <p className="text-[12px] text-[#bbb] italic">Nenhum próximo passo registrado.</p>;
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-[#F7F7F7] border-b border-[#E8E8E8]">
              <th className="px-2 py-1.5 text-left text-[10px] font-semibold text-[#888] uppercase tracking-wide">Ação</th>
              <th className="px-2 py-1.5 text-left text-[10px] font-semibold text-[#888] uppercase tracking-wide w-32">Responsável</th>
              <th className="px-2 py-1.5 text-left text-[10px] font-semibold text-[#888] uppercase tracking-wide w-24">Prazo</th>
              <th className="px-2 py-1.5 text-center text-[10px] font-semibold text-[#888] uppercase tracking-wide w-20">Status</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((step) => (
              <tr key={step.id} className="border-b border-[#F2F2F2] last:border-0">
                <td className="px-2 py-1.5">
                  <span className={step.concluido ? "text-[#bbb] line-through" : "text-[#333]"}>{step.descricao}</span>
                </td>
                <td className="px-2 py-1.5 text-[#666]">{step.responsavel}</td>
                <td className="px-2 py-1.5 text-[#666]">{formatDate(step.prazo)}</td>
                <td className="px-2 py-1.5 text-center">
                  <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-sm ${step.concluido ? "bg-[#EDFAE9] text-[#3d8b2e]" : "bg-[#FEF8E6] text-[#b88800]"}`}>
                    {step.concluido ? <><Check size={9} /> Concluído</> : "Pendente"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {steps.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-[#E8E8E8]">
                <th className="pb-1.5 text-left text-[10px] font-medium text-[#999] pr-2">Ação</th>
                <th className="pb-1.5 text-left text-[10px] font-medium text-[#999] pr-2 w-32">Responsável</th>
                <th className="pb-1.5 text-left text-[10px] font-medium text-[#999] pr-2 w-28">Prazo</th>
                <th className="pb-1.5 text-center text-[10px] font-medium text-[#999] w-16">Feito</th>
                <th className="pb-1.5 w-6" />
              </tr>
            </thead>
            <tbody>
              {steps.map((step) => (
                <tr key={step.id} className="border-b border-[#F5F5F5] last:border-0">
                  <td className="py-1 pr-2">
                    <input className="bubble-input" placeholder="Descreva a ação" value={step.descricao} onChange={(e) => updateStep(step.id, "descricao", e.target.value)} />
                  </td>
                  <td className="py-1 pr-2">
                    <input className="bubble-input" placeholder="Responsável" value={step.responsavel} onChange={(e) => updateStep(step.id, "responsavel", e.target.value)} />
                  </td>
                  <td className="py-1 pr-2">
                    <input type="date" className="bubble-input" value={step.prazo} onChange={(e) => updateStep(step.id, "prazo", e.target.value)} />
                  </td>
                  <td className="py-1 text-center">
                    <input type="checkbox" checked={step.concluido} onChange={(e) => updateStep(step.id, "concluido", e.target.checked)} className="w-3.5 h-3.5 rounded-sm border-[#D0D0D0] accent-[#D80030] cursor-pointer" />
                  </td>
                  <td className="py-1">
                    <button onClick={() => removeStep(step.id)} className="p-0.5 text-[#ccc] hover:text-[#D80030] transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button onClick={addStep} className="flex items-center gap-1.5 text-[12px] text-[#666] hover:text-[#D80030] transition-colors">
        <Plus size={13} /> Adicionar próximo passo
      </button>
    </div>
  );
}

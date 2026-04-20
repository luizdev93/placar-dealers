"use client";

import React from "react";
import { Participant } from "@/lib/types";
import { Plus, Trash2, User } from "lucide-react";

interface RVParticipantsFieldProps {
  participants: Participant[];
  onChange: (participants: Participant[]) => void;
  readonly?: boolean;
}

export function RVParticipantsField({ participants, onChange, readonly = false }: RVParticipantsFieldProps) {
  const addParticipant = () => {
    onChange([...participants, { id: `p_${Date.now()}`, nome: "", cargo: "", tipo: "dealer" }]);
  };

  const updateParticipant = (id: string, field: keyof Participant, value: string) => {
    onChange(participants.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const removeParticipant = (id: string) => {
    onChange(participants.filter((p) => p.id !== id));
  };

  if (readonly) {
    return (
      <div className="space-y-1.5">
        {participants.length === 0 && <p className="text-[12px] text-[#bbb] italic">Nenhum participante informado.</p>}
        {participants.map((p) => (
          <div key={p.id} className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#F0F0F0] flex items-center justify-center flex-none">
              <User size={11} className="text-[#aaa]" />
            </div>
            <div>
              <p className="text-[13px] text-[#333]">{p.nome}</p>
              <p className="text-[11px] text-[#999]">
                {p.cargo}
                {p.tipo === "consultor" && <span className="ml-1 text-[#D80030]">· Consultor</span>}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {participants.map((p, idx) => (
        <div key={p.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_auto] gap-2 items-end">
          <div className="flex flex-col gap-1">
            {idx === 0 && <label className="text-[10px] font-medium text-[#999] uppercase tracking-wide">Nome</label>}
            <input className="bubble-input" placeholder="Nome do participante" value={p.nome} onChange={(e) => updateParticipant(p.id, "nome", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            {idx === 0 && <label className="text-[10px] font-medium text-[#999] uppercase tracking-wide">Cargo</label>}
            <input className="bubble-input" placeholder="Cargo / função" value={p.cargo} onChange={(e) => updateParticipant(p.id, "cargo", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            {idx === 0 && <label className="text-[10px] font-medium text-[#999] uppercase tracking-wide">Tipo</label>}
            <select className="bubble-input w-auto" value={p.tipo} onChange={(e) => updateParticipant(p.id, "tipo", e.target.value as "dealer" | "consultor")}>
              <option value="dealer">Dealer</option>
              <option value="consultor">Consultor</option>
            </select>
          </div>
          <div className={idx === 0 ? "mt-5" : ""}>
            <button onClick={() => removeParticipant(p.id)} className="h-8 w-8 flex items-center justify-center border border-[#E0E0E0] text-[#bbb] hover:text-[#D80030] hover:border-[#D80030]/40 transition-colors rounded-sm">
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}

      <button onClick={addParticipant} className="flex items-center gap-1.5 text-[12px] text-[#666] hover:text-[#D80030] transition-colors mt-1">
        <Plus size={13} /> Adicionar participante
      </button>
    </div>
  );
}

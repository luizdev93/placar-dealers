"use client";

import React, { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles, Check, X, Pencil } from "lucide-react";

interface RVAIImproveModalProps {
  open: boolean;
  onClose: () => void;
  originalText: string;
  improvedText: string;
  onAccept: (text: string) => void;
}

function diffWords(original: string, improved: string) {
  const origWords = original.split(/(\s+)/);
  const impWords = improved.split(/(\s+)/);
  const result: { text: string; type: "same" | "added" | "removed" }[] = [];
  const maxLen = Math.max(origWords.length, impWords.length);
  for (let i = 0; i < maxLen; i++) {
    const orig = origWords[i] || "";
    const imp = impWords[i] || "";
    if (orig === imp) result.push({ text: orig, type: "same" });
    else { if (orig) result.push({ text: orig, type: "removed" }); if (imp) result.push({ text: imp, type: "added" }); }
  }
  return result;
}

export function RVAIImproveModal({ open, onClose, originalText, improvedText, onAccept }: RVAIImproveModalProps) {
  const diff = useMemo(() => diffWords(originalText, improvedText), [originalText, improvedText]);
  const [partialMode, setPartialMode] = useState(false);
  const [partialText, setPartialText] = useState(improvedText);

  const handlePartialMode = () => {
    setPartialText(improvedText);
    setPartialMode(true);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { setPartialMode(false); onClose(); } }}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#333] text-base font-semibold">
            <Sparkles size={15} className="text-[#b88800]" /> Sugestão de melhoria — IA
          </DialogTitle>
        </DialogHeader>

        {partialMode ? (
          <div className="flex flex-col gap-2 flex-1 min-h-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-[#999] uppercase tracking-wide">Edição parcial</span>
              <span className="text-[10px] text-[#bbb]">— ajuste o texto sugerido conforme necessário</span>
            </div>
            <textarea
              className="bubble-textarea flex-1 min-h-[220px]"
              value={partialText}
              onChange={(e) => setPartialText(e.target.value)}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-3 min-h-0">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-[#999] uppercase tracking-wide">Original</span>
                <span className="px-1 py-0.5 bg-[#F2F2F2] text-[#999] text-[9px] rounded-sm font-medium">Atual</span>
              </div>
              <div className="flex-1 overflow-y-auto bg-[#FAFAFA] border border-[#E8E8E8] p-3 text-[12px] text-[#666] leading-relaxed">
                {originalText}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-[#3d8b2e] uppercase tracking-wide">Sugestão IA</span>
                <span className="px-1 py-0.5 bg-[#EDFAE9] text-[#3d8b2e] text-[9px] rounded-sm font-medium">Revisado</span>
              </div>
              <div className="flex-1 overflow-y-auto bg-white border border-[#C6EFC0] p-3 text-[12px] leading-relaxed">
                {diff.map((token, i) => {
                  if (token.type === "same") return <span key={i} className="text-[#333]">{token.text}</span>;
                  if (token.type === "added") return <span key={i} className="bg-[#EDFAE9] text-[#3d8b2e] underline">{token.text}</span>;
                  return <span key={i} className="line-through text-[#ccc] bg-[#F5F5F5]">{token.text}</span>;
                })}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-[#EFEFEF] mt-2">
          <p className="text-[10px] text-[#ccc]">Gerado por IA · Revise antes de aceitar</p>
          <div className="flex gap-2">
            <button
              onClick={() => { setPartialMode(false); onClose(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E0E0E0] text-[12px] text-[#666] hover:bg-[#F5F5F5] transition-colors rounded-sm"
            >
              <X size={12} /> Descartar
            </button>

            {!partialMode && (
              <button
                onClick={handlePartialMode}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E0E0E0] text-[12px] text-[#555] hover:bg-[#F5F5F5] transition-colors rounded-sm"
                title="Aceitar parcialmente — edite a sugestão antes de confirmar"
              >
                <Pencil size={12} /> Aceitar parcialmente
              </button>
            )}

            <button
              onClick={() => {
                onAccept(partialMode ? partialText : improvedText);
                setPartialMode(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3d8b2e] text-white text-[12px] font-medium hover:bg-[#2d6a22] transition-colors rounded-sm"
            >
              <Check size={12} /> {partialMode ? "Confirmar edição" : "Aceitar sugestão"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

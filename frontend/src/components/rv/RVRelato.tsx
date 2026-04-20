"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Mic, Square, Sparkles, Bold, Italic, List } from "lucide-react";
import { FAKE_AUDIO_TRANSCRIPTION, FAKE_AI_IMPROVED_TEXT, cn } from "@/lib/utils";
import { RVAIImproveModal } from "./RVAIImproveModal";
import { toast } from "sonner";

interface RVRelatoProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  showAI?: boolean;
  readonly?: boolean;
}

/** Renderiza Markdown simples (negrito, itálico, listas) como HTML sanitizado. */
function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.*?)_/g, "<em>$1</em>")
    .replace(/^- (.+)/gm, "<li>$1</li>")
    .replace(/(<li>[^<]*<\/li>\n?)+/g, (match) => `<ul style="margin:4px 0;padding-left:20px">${match}</ul>`);
}

export function RVRelato({
  label, value, onChange, placeholder = "Descreva o relato...", rows = 7, showAI = true, readonly = false,
}: RVRelatoProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showAIModal, setShowAIModal] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const valueRef = useRef(value);
  useEffect(() => { valueRef.current = value; });

  /* ── Format helpers ── */
  const applyFormat = useCallback((tag: "**" | "_" | "list") => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    let newText: string;
    if (tag === "list") {
      const prefix = start > 0 && value[start - 1] !== "\n" ? "\n" : "";
      newText = value.substring(0, start) + prefix + "- " + (selected || "item") + value.substring(end);
    } else {
      newText = value.substring(0, start) + tag + (selected || "texto") + tag + value.substring(end);
    }
    onChange(newText);
    // Restore focus after state update
    setTimeout(() => textarea.focus(), 0);
  }, [value, onChange]);

  /* ── Audio recording ── */
  const startRecording = useCallback(() => {
    setIsRecording(true);
    setRecordingSeconds(0);
    let sec = 0;
    const interval = setInterval(() => {
      sec++;
      setRecordingSeconds(sec);
      if (sec >= 5) {
        clearInterval(interval);
        setIsRecording(false);
        setRecordingSeconds(0);
        const current = valueRef.current;
        onChange(current + (current ? "\n\n" : "") + FAKE_AUDIO_TRANSCRIPTION);
        toast.success("Áudio transcrito (simulado)");
      }
    }, 1000);
  }, [onChange]);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    setRecordingSeconds(0);
  }, []);

  const handleImproveText = useCallback(() => {
    if (!value.trim()) { toast.error("Escreva algo antes de usar a IA."); return; }
    setIsLoadingAI(true);
    setTimeout(() => { setIsLoadingAI(false); setShowAIModal(true); }, 1500);
  }, [value]);

  /* ── Readonly ── */
  if (readonly) {
    return (
      <div>
        <label className="label" style={{ marginBottom: 6 }}>{label}</label>
        <div
          className="bubble-block"
          style={{ fontSize: 13, color: "#252525", lineHeight: 1.6, minHeight: 40 }}
          dangerouslySetInnerHTML={
            value
              ? { __html: renderMarkdown(value) }
              : undefined
          }
        >
          {!value && <span style={{ color: "#9e9e9e", fontStyle: "italic" }}>Não informado.</span>}
        </div>
      </div>
    );
  }

  const toolbarBtnStyle: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: 28, height: 28, fontSize: 12, fontWeight: 700,
    borderRadius: 4, border: "1px solid #e0e0e0", cursor: "pointer",
    background: "#fff", color: "#616161",
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <label className="label">{label}</label>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {/* Formatting toolbar */}
            <div style={{ display: "flex", gap: 3, borderRight: "1px solid #e0e0e0", paddingRight: 8 }}>
              <button
                type="button"
                onClick={() => applyFormat("**")}
                style={toolbarBtnStyle}
                title="Negrito (selecione o texto primeiro)"
              >
                <Bold size={13} />
              </button>
              <button
                type="button"
                onClick={() => applyFormat("_")}
                style={{ ...toolbarBtnStyle, fontStyle: "italic" }}
                title="Itálico (selecione o texto primeiro)"
              >
                <Italic size={13} />
              </button>
              <button
                type="button"
                onClick={() => applyFormat("list")}
                style={toolbarBtnStyle}
                title="Inserir item de lista"
              >
                <List size={13} />
              </button>
            </div>

            {showAI && (
              <>
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={cn(isRecording ? "mic-recording" : "")}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "0 10px", height: 28, fontSize: 12, fontWeight: 500,
                    borderRadius: 4, border: "1px solid #e0e0e0", cursor: "pointer",
                    background: isRecording ? "#000" : "#fff",
                    color: isRecording ? "#fff" : "#616161",
                  }}
                >
                  {isRecording ? <><Square size={10} /> {recordingSeconds}s</> : <><Mic size={11} /> Gravar</>}
                </button>

                <button
                  type="button"
                  onClick={handleImproveText}
                  disabled={isLoadingAI}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "0 10px", height: 28, fontSize: 12, fontWeight: 500,
                    borderRadius: 4, border: "1px solid #e0e0e0", cursor: isLoadingAI ? "wait" : "pointer",
                    background: "#fff", color: "#616161", opacity: isLoadingAI ? 0.6 : 1,
                  }}
                >
                  {isLoadingAI
                    ? <><span style={{ width: 10, height: 10, border: "2px solid #ccc", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> IA...</>
                    : <><Sparkles size={11} /> Melhorar</>}
                </button>
              </>
            )}
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <textarea
            ref={textareaRef}
            className="bubble-textarea"
            rows={rows}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ paddingBottom: 24 }}
          />
          <span style={{ position: "absolute", bottom: 8, right: 10, fontSize: 10, color: "#D0D0D0", userSelect: "none" }}>
            {value.length}
          </span>
        </div>

        {isRecording && (
          <p style={{ fontSize: 12, color: "#000", fontWeight: 500 }}>● Gravando... {recordingSeconds}s</p>
        )}

        <p style={{ fontSize: 10, color: "#ccc" }}>
          Dica: use <strong>**negrito**</strong>, <em>_itálico_</em> ou - lista para formatar o texto.
        </p>
      </div>

      <RVAIImproveModal
        open={showAIModal}
        onClose={() => setShowAIModal(false)}
        originalText={value}
        improvedText={FAKE_AI_IMPROVED_TEXT(value)}
        onAccept={(improved) => { onChange(improved); setShowAIModal(false); toast.success("Texto melhorado."); }}
      />
    </>
  );
}

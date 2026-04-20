"use client";

import React, { useRef, useState } from "react";
import { Attachment } from "@/lib/types";
import { Upload, FileText, File, X, Download, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface RVAttachmentsAreaProps {
  attachments: Attachment[];
  onChange: (attachments: Attachment[]) => void;
  readonly?: boolean;
}

function AttachmentPreview({ att }: { att: Attachment }) {
  if (att.tipo === "image" && att.urlFake) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={att.urlFake}
        alt={att.nome}
        style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6, flexShrink: 0, border: "1px solid #eee" }}
      />
    );
  }
  if (att.tipo === "video" && att.urlFake) {
    return (
      <video
        src={att.urlFake}
        style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6, flexShrink: 0, border: "1px solid #eee" }}
        preload="metadata"
        muted
        playsInline
      />
    );
  }
  return <FileIcon tipo={att.tipo} />;
}

function FileIcon({ tipo }: { tipo: Attachment["tipo"] }) {
  switch (tipo) {
    case "pdf":    return <FileText size={18} style={{ color: "#c0002a", flexShrink: 0 }} />;
    case "image":  return <File size={18} style={{ color: "#2f3f78", flexShrink: 0 }} />;
    case "video":  return <File size={18} style={{ color: "#7b2fa8", flexShrink: 0 }} />;
    default:       return <File size={18} style={{ color: "#b88800", flexShrink: 0 }} />;
  }
}

interface UploadingFile { name: string; progress: number; }

export function RVAttachmentsArea({ attachments, onChange, readonly = false }: RVAttachmentsAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const ACCEPTED_TYPES = [
    "image/jpeg", "image/png", "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "video/mp4", "video/quicktime",
  ];

  const MAX_TOTAL_MB = 20;

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const totalCurrent = attachments.reduce((acc, a) => acc + parseFloat(a.tamanho), 0);

    Array.from(files).forEach((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        import("sonner").then(({ toast }) =>
          toast.error(`Formato nÃ£o suportado: ${file.name}. Use JPG, PNG, PDF, DOC, XLS, MP4 ou MOV.`)
        );
        return;
      }
      const fileMB = file.size / (1024 * 1024);
      if (totalCurrent + fileMB > MAX_TOTAL_MB) {
        import("sonner").then(({ toast }) =>
          toast.error(`Limite de ${MAX_TOTAL_MB} MB total excedido.`)
        );
        return;
      }

      setUploading((prev) => [...prev, { name: file.name, progress: 0 }]);
      let prog = 0;
      const interval = setInterval(() => {
        prog += Math.random() * 30 + 10;
        if (prog >= 100) {
          prog = 100;
          clearInterval(interval);
          const tipo: Attachment["tipo"] = file.type.startsWith("image/")
            ? "image"
            : file.type === "application/pdf"
            ? "pdf"
            : file.type === "video/mp4" || file.type === "video/quicktime"
            ? "video"
            : "doc";
          onChange([
            ...attachments,
            {
              id: `att_${Date.now()}`,
              nome: file.name,
              tipo,
              tamanho: formatSize(file.size),
              urlFake: URL.createObjectURL(file),
            },
          ]);
          setUploading((prev) => prev.filter((u) => u.name !== file.name));
        } else {
          setUploading((prev) =>
            prev.map((u) => u.name === file.name ? { ...u, progress: Math.round(prog) } : u)
          );
        }
      }, 150);
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  /* â”€â”€ Readonly â”€â”€ */
  if (readonly) {
    if (attachments.length === 0)
      return <p style={{ fontSize: 12, color: "#9e9e9e", fontStyle: "italic" }}>Nenhum anexo.</p>;
    return (
      <div>
        {attachments.map((att) => (
          <div
            key={att.id}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 0", borderBottom: "1px solid #f5f5f5",
            }}
          >
            <AttachmentPreview att={att} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, color: "#252525", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {att.nome}
              </p>
              <p style={{ fontSize: 11, color: "#9e9e9e" }}>{att.tamanho}</p>
            </div>
            <a
              href={att.urlFake}
              download={att.nome}
              style={{ color: "#9e9e9e", display: "flex" }}
              title="Baixar"
            >
              <Download size={13} />
            </a>
          </div>
        ))}
      </div>
    );
  }

  /* â”€â”€ Edit mode â”€â”€ */
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Drop zone */}
      <div
        className={cn(
          "border border-dashed rounded-sm p-4 text-center cursor-pointer transition-colors",
          dragOver ? "border-[#000] bg-[#f5f5f5]" : "border-[#D8D8D8] bg-[#FAFAFA] hover:border-[#aaa]"
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      >
        <Upload size={20} style={{ color: "#ccc", margin: "0 auto 4px" }} />
        <p style={{ fontSize: 12, color: "#9e9e9e" }}>
          Arraste ou <span style={{ color: "#000", fontWeight: 600 }}>clique para selecionar</span>
        </p>
        <p style={{ fontSize: 10, color: "#ccc", marginTop: 2 }}>
          PDF, imagens (JPG, PNG, WEBP), vÃ­deos (MP4, MOV), documentos Â· mÃ¡x. 20 MB total
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx,.mp4,.mov"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Uploading */}
      {uploading.map((u) => (
        <div key={u.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
          <Paperclip size={12} style={{ color: "#ccc", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12, color: "#252525", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</p>
            <div style={{ marginTop: 4, height: 3, background: "#f0f0f0", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", background: "#000", borderRadius: 2, width: `${u.progress}%`, transition: "width 0.15s" }} />
            </div>
          </div>
          <span style={{ fontSize: 10, color: "#9e9e9e" }}>{u.progress}%</span>
        </div>
      ))}

      {/* Existing attachments */}
      {attachments.map((att) => (
        <div
          key={att.id}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "6px 0", borderBottom: "1px solid #f5f5f5",
          }}
        >
          <AttachmentPreview att={att} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, color: "#252525", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {att.nome}
            </p>
            <p style={{ fontSize: 11, color: "#9e9e9e" }}>{att.tamanho}</p>
          </div>
          <button
            onClick={() => onChange(attachments.filter((a) => a.id !== att.id))}
            style={{ color: "#ccc", background: "none", border: "none", cursor: "pointer", display: "flex", padding: 2 }}
            title="Remover"
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}


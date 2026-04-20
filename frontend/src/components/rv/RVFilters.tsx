"use client";

import React from "react";
import { X } from "lucide-react";
import { RVFiltersState } from "@/lib/types";
import { mockDealers } from "@/lib/mocks/dealers";
import { getConsultores } from "@/lib/mocks/users";

const STATUS_OPTIONS = [
  { value: "", label: "Todos os status" },
  { value: "rascunho", label: "Rascunho" },
  { value: "enviado", label: "Enviado" },
  { value: "lembrete1", label: "Lembrete 1" },
  { value: "lembrete2", label: "Lembrete 2" },
  { value: "assinado", label: "Assinado" },
  { value: "expirado", label: "Expirado" },
];

const REGIOES = ["Sudeste", "Sul", "Norte", "Nordeste", "Centro-Oeste"];

/* Estilo exato de input de filtro conforme spec */
const filterInputStyle: React.CSSProperties = {
  height: 32,
  padding: "0 8px",
  border: "1px solid #e0e0e0",
  borderRadius: 6,
  background: "#ffffff",
  fontSize: 12,
  fontFamily: "var(--font-roboto), 'Roboto', sans-serif",
  color: "#252525",
  outline: "none",
  width: "100%",
};

interface RVFiltersProps {
  filters: RVFiltersState;
  onFilterChange: (key: keyof RVFiltersState, value: string) => void;
  onClear: () => void;
  showConsultorFilter?: boolean;
  showRegiaoFilter?: boolean;
}

export function RVFilters({
  filters, onFilterChange, onClear,
  showConsultorFilter = false, showRegiaoFilter = false,
}: RVFiltersProps) {
  const consultores = getConsultores();
  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  const fieldStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minWidth: 140,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 600,
    color: "#616161",
    display: "block",
  };

  return (
    <div className="bubble-card" style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>

        <div style={fieldStyle}>
          <label style={labelStyle}>Dealer</label>
          <select
            style={filterInputStyle}
            value={filters.dealerId}
            onChange={(e) => onFilterChange("dealerId", e.target.value)}
          >
            <option value="">Todos</option>
            {mockDealers.map((d) => <option key={d.id} value={d.id}>{d.nome}</option>)}
          </select>
        </div>

        {showConsultorFilter && (
          <div style={fieldStyle}>
            <label style={labelStyle}>Consultor</label>
            <select
              style={filterInputStyle}
              value={filters.consultorId}
              onChange={(e) => onFilterChange("consultorId", e.target.value)}
            >
              <option value="">Todos</option>
              {consultores.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
        )}

        {showRegiaoFilter && (
          <div style={fieldStyle}>
            <label style={labelStyle}>Região</label>
            <select
              style={filterInputStyle}
              value={filters.regiao}
              onChange={(e) => onFilterChange("regiao", e.target.value)}
            >
              <option value="">Todas</option>
              {REGIOES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        )}

        <div style={fieldStyle}>
          <label style={labelStyle}>Status</label>
          <select
            style={filterInputStyle}
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
          >
            {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>De</label>
          <input
            type="date"
            style={filterInputStyle}
            value={filters.dataInicio}
            onChange={(e) => onFilterChange("dataInicio", e.target.value)}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Até</label>
          <input
            type="date"
            style={filterInputStyle}
            value={filters.dataFim}
            onChange={(e) => onFilterChange("dataFim", e.target.value)}
          />
        </div>

        {hasActiveFilters && (
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button
              onClick={onClear}
              style={{
                height: 32,
                padding: "0 12px",
                fontSize: 12,
                fontWeight: 400,
                background: "#ffffff",
                border: "1px solid #e0e0e0",
                borderRadius: 6,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                color: "#616161",
                fontFamily: "var(--font-roboto), 'Roboto', sans-serif",
              }}
            >
              <X size={12} /> Limpar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

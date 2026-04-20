"use client";

import React, { useState, useLayoutEffect } from "react";
import Link from "next/link";
import { Eye, Pencil, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { RVReport } from "@/lib/types";
import { RVStatusBadge } from "./RVStatusBadge";
import { getMockDealerById } from "@/lib/mocks/dealers";
import { getMockUserById } from "@/lib/mocks/users";
import { formatDate } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePermissions } from "@/hooks/usePermissions";

interface RVTableProps {
  rvReports: RVReport[];
  isLoading?: boolean;
}

const PAGE_SIZE = 10;

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: "8px 12px" }}>
          <div style={{ height: 11, background: "#f0f0f0", borderRadius: 3, width: "70%" }} />
        </td>
      ))}
    </tr>
  );
}

export function RVTable({ rvReports, isLoading = false }: RVTableProps) {
  const { currentUser } = useCurrentUser();
  const permissions = usePermissions(currentUser);
  const [page, setPage] = useState(1);

  const listKey = rvReports.map((r) => r.id).join("|");
  useLayoutEffect(() => {
    setPage(1);
  }, [listKey]);

  const totalPages = Math.max(1, Math.ceil(rvReports.length / PAGE_SIZE));
  /** Evita slice vazio quando a lista encolhe (filtro) mas o estado ainda está em página alta */
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paginated = rvReports.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const colCount = permissions.showConsultorColumn ? 8 : 7;

  /* ── Estado vazio ── */
  if (!isLoading && rvReports.length === 0) {
    return (
      <div className="bubble-card" style={{ textAlign: "center", padding: "40px 20px" }}>
        <FileText size={28} style={{ color: "#e0e0e0", margin: "0 auto 8px" }} />
        <p style={{ fontSize: 13, color: "#9e9e9e", fontWeight: 400 }}>Nenhum relatório encontrado</p>
        <p style={{ fontSize: 12, color: "#bdbdbd", marginTop: 4 }}>Ajuste os filtros ou crie um novo relatório.</p>
      </div>
    );
  }

  return (
    <div>
      {/* ── Desktop table ── */}
      <div className="bubble-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }} className="hidden md:block">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #eeeeee" }}>
                <th style={thStyle}>Dealer</th>
                {permissions.showConsultorColumn && <th style={thStyle}>Consultor</th>}
                <th style={thStyle}>Data</th>
                <th style={thStyle} className="hidden lg:table-cell">Foco</th>
                <th style={thStyle} className="hidden xl:table-cell">Modalidade</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle} className="hidden xl:table-cell">Ciência em</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={colCount} />)
                : paginated.map((rv) => {
                    const dealer = getMockDealerById(rv.dealerId);
                    const consultor = getMockUserById(rv.consultorId);
                    const canEdit = permissions.canEditRV(rv);
                    return (
                      <tr
                        key={rv.id}
                        style={{ borderBottom: "1px solid #eeeeee", cursor: "default" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={tdStyle}>
                          {/* Dealer: nome bold, cidade cinza */}
                          <p style={{ fontSize: 12, fontWeight: 700, color: "#252525" }}>
                            {dealer?.nome || rv.dealerId}
                          </p>
                          <p style={{ fontSize: 12, color: "#9e9e9e", marginTop: 1 }}>
                            {dealer?.cidade}, {dealer?.estado}
                          </p>
                        </td>
                        {permissions.showConsultorColumn && (
                          <td style={tdStyle}>
                            <p style={{ fontSize: 12, fontWeight: 400, color: "#252525" }}>
                              {consultor?.nome || rv.consultorId}
                            </p>
                          </td>
                        )}
                        <td style={tdStyle}>
                          {/* Data: principal + horário menor */}
                          <p style={{ fontSize: 12, fontWeight: 400, color: "#252525" }}>
                            {formatDate(rv.dataVisita)}
                          </p>
                          <p style={{ fontSize: 12, color: "#9e9e9e", marginTop: 1 }}>
                            {rv.horaInicio}–{rv.horaFim}
                          </p>
                        </td>
                        <td style={tdStyle} className="hidden lg:table-cell">
                          <p style={{ fontSize: 12, fontWeight: 400, color: "#252525", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {rv.foco}
                          </p>
                        </td>
                        <td style={tdStyle} className="hidden xl:table-cell">
                          <p style={{ fontSize: 12, fontWeight: 400, color: "#9e9e9e" }}>{rv.modalidade}</p>
                        </td>
                        <td style={tdStyle}>
                          <RVStatusBadge status={rv.status} size="sm" />
                        </td>
                        <td style={tdStyle} className="hidden xl:table-cell">
                          <p style={{ fontSize: 12, fontWeight: 400, color: "#9e9e9e" }}>
                            {rv.dataAssinatura ? formatDate(rv.dataAssinatura) : "—"}
                          </p>
                        </td>
                        <td style={{ ...tdStyle, textAlign: "right" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                            <Link href={`/rv/${rv.id}`} title="Ver" style={iconBtnStyle}>
                              <Eye size={14} />
                            </Link>
                            {canEdit && (
                              <Link href={`/rv/${rv.id}?mode=edit`} title="Editar" style={iconBtnStyle}>
                                <Pencil size={14} />
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>

        {/* ── Mobile cards ── */}
        <div className="md:hidden">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ padding: "10px 14px", borderBottom: "1px solid #eeeeee" }}>
                  <div style={{ height: 11, background: "#f0f0f0", borderRadius: 3, width: "55%", marginBottom: 6 }} />
                  <div style={{ height: 10, background: "#f0f0f0", borderRadius: 3, width: "30%" }} />
                </div>
              ))
            : paginated.map((rv) => {
                const dealer = getMockDealerById(rv.dealerId);
                const consultor = getMockUserById(rv.consultorId);
                const canEdit = permissions.canEditRV(rv);
                return (
                  <div key={rv.id} style={{ padding: "10px 14px", borderBottom: "1px solid #eeeeee" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 3 }}>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: "#252525" }}>{dealer?.nome || rv.dealerId}</p>
                        {permissions.showConsultorColumn && (
                          <p style={{ fontSize: 12, color: "#9e9e9e" }}>{consultor?.nome}</p>
                        )}
                      </div>
                      <RVStatusBadge status={rv.status} size="sm" />
                    </div>
                    <p style={{ fontSize: 12, color: "#9e9e9e", marginBottom: 8 }}>
                      {formatDate(rv.dataVisita)} · {rv.foco}
                    </p>
                    <div style={{ display: "flex", gap: 12 }}>
                      <Link href={`/rv/${rv.id}`} style={{ fontSize: 12, color: "#252525", display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
                        <Eye size={12} /> Ver
                      </Link>
                      {canEdit && (
                        <Link href={`/rv/${rv.id}?mode=edit`} style={{ fontSize: 12, color: "#252525", display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
                          <Pencil size={12} /> Editar
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
        </div>
      </div>

      {/* ── Paginação (valores exatos) ── */}
      {!isLoading && rvReports.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20, marginTop: 20 }}>
          <button
            type="button"
            className="btn-page"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            aria-label="Página anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <span style={{ fontSize: 14, fontWeight: 400, color: "#000000", userSelect: "none", minWidth: 120, textAlign: "center" }}>
            Página {safePage} de {totalPages}
          </span>
          <button
            type="button"
            className="btn-page"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            aria-label="Próxima página"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

/* Estilos de tabela (valores exatos da spec) */
const thStyle: React.CSSProperties = {
  padding: "8px 12px",
  textAlign: "left",
  fontSize: 12,
  fontWeight: 600,
  color: "#616161",
  whiteSpace: "nowrap",
  background: "#fafafa",
  borderBottom: "1px solid #eeeeee",
};

const tdStyle: React.CSSProperties = {
  padding: "8px 12px",
  verticalAlign: "middle",
};

const iconBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  color: "#9e9e9e",
  textDecoration: "none",
  background: "none",
  border: "none",
  cursor: "pointer",
  borderRadius: 4,
};

"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { RVTable } from "@/components/rv/RVTable";
import { RVFilters } from "@/components/rv/RVFilters";
import { RVStatusBadge } from "@/components/rv/RVStatusBadge";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePermissions } from "@/hooks/usePermissions";
import { useRVList } from "@/hooks/useRVList";
import { RVStatus } from "@/lib/types";

const STATUS_ORDER: RVStatus[] = ["rascunho", "enviado", "lembrete1", "lembrete2", "assinado", "expirado"];

export default function RVListPage() {
  const { currentUser } = useCurrentUser();
  const permissions = usePermissions(currentUser);
  const { rvReports, poolBeforeStatus, filters, updateFilter, clearFilters, isLoading } = useRVList();

  const counts = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = poolBeforeStatus.filter((rv) => rv.status === s).length;
    return acc;
  }, {} as Record<RVStatus, number>);

  return (
    <>
      <PageHeader
        title="Relatórios de Visita"
        subtitle={`${rvReports.length} registro${rvReports.length !== 1 ? "s" : ""}`}
        actions={
          permissions.canCreateRV ? (
            <Link href="/rv/novo" className="btn-primary">
              <Plus size={15} /> Novo RV
            </Link>
          ) : undefined
        }
      />

      <div className="flex flex-wrap gap-2 mb-3">
        {STATUS_ORDER.map((s) => {
          const active = filters.status === s;
          const dimmed = Boolean(filters.status) && !active;
          return (
            <button
              key={s}
              type="button"
              onClick={() => updateFilter("status", active ? "" : s)}
              className={`flex items-center gap-1 transition-opacity duration-150 ${
                dimmed ? "opacity-35 hover:opacity-55" : "opacity-100"
              }`}
            >
              <RVStatusBadge
                status={s}
                size="sm"
                className={active ? "ring-1 ring-offset-1 ring-[#D80030]/30" : ""}
              />
              <span className={`text-[10px] ${dimmed ? "text-[#ccc]" : "text-[#aaa]"}`}>({counts[s]})</span>
            </button>
          );
        })}
      </div>

      <RVFilters filters={filters} onFilterChange={updateFilter} onClear={clearFilters} showConsultorFilter={permissions.showConsultorFilter} />
      <RVTable rvReports={rvReports} isLoading={isLoading} />
    </>
  );
}

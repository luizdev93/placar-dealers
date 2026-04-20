import { useMemo, useState } from "react";
import { useRVContext } from "@/contexts/RVContext";
import { useCurrentUser } from "./useCurrentUser";
import { filterRVsByProfile } from "@/lib/permissions";
import { RVFiltersState, RVReport } from "@/lib/types";
import { getMockDealerById } from "@/lib/mocks/dealers";

const INITIAL_FILTERS: RVFiltersState = {
  dealerId: "",
  consultorId: "",
  status: "",
  dataInicio: "",
  dataFim: "",
  regiao: "",
};

export function useRVList() {
  const { rvReports } = useRVContext();
  const { currentUser } = useCurrentUser();
  const [filters, setFilters] = useState<RVFiltersState>(INITIAL_FILTERS);
  const [isLoading] = useState(false);

  /** Mesmos filtros da tabela, exceto status — para chips de status não sumirem ao filtrar */
  const poolBeforeStatus = useMemo(() => {
    let base: RVReport[] = filterRVsByProfile(rvReports, currentUser);

    if (filters.dealerId) {
      base = base.filter((rv) => rv.dealerId === filters.dealerId);
    }
    if (filters.consultorId) {
      base = base.filter((rv) => rv.consultorId === filters.consultorId);
    }
    if (filters.dataInicio) {
      base = base.filter((rv) => rv.dataVisita >= filters.dataInicio);
    }
    if (filters.dataFim) {
      base = base.filter((rv) => rv.dataVisita <= filters.dataFim);
    }
    if (filters.regiao) {
      base = base.filter((rv) => {
        const dealer = getMockDealerById(rv.dealerId);
        return dealer?.regiao === filters.regiao;
      });
    }

    return base;
  }, [
    rvReports,
    currentUser,
    filters.dealerId,
    filters.consultorId,
    filters.dataInicio,
    filters.dataFim,
    filters.regiao,
  ]);

  const filtered = useMemo(() => {
    if (!filters.status) return poolBeforeStatus;
    return poolBeforeStatus.filter((rv) => rv.status === filters.status);
  }, [poolBeforeStatus, filters.status]);

  const updateFilter = (key: keyof RVFiltersState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => setFilters(INITIAL_FILTERS);

  return {
    rvReports: filtered,
    poolBeforeStatus,
    filters,
    updateFilter,
    clearFilters,
    isLoading,
    totalCount: filtered.length,
  };
}

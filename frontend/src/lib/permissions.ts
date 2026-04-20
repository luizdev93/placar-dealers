import { User, RVReport, UserProfile } from "./types";

export interface Permissions {
  canCreateRV: boolean;
  canEditRV: (rv: RVReport) => boolean;
  canSendRV: (rv: RVReport) => boolean;
  canViewAvaliacaoConsultor: boolean;
  canManageDomains: boolean;
  canViewAllRVs: boolean;
  canSignRV: boolean;
  canAccessAdmin: boolean;
  canViewAgendamentos: boolean;
  canDeclineVisit: boolean;
  canAddToOutlook: boolean;
  showConsultorColumn: boolean;
  showConsultorFilter: boolean;
}

export function getPermissions(user: User): Permissions {
  const perfil = user.perfil;

  const isDealer = perfil === "operador" || perfil === "gerente_dealer";
  const isConsultor = perfil === "consultor";
  const isAdmin = perfil === "admin";
  const isGerenteRegional = perfil === "gerente_regional";

  return {
    canCreateRV: isConsultor || isAdmin,

    canEditRV: (rv: RVReport) => {
      // RV editável em rascunho ou enviado (antes da assinatura) — conforme seção 4 do documento
      const editableStatuses = ["rascunho", "enviado", "lembrete1", "lembrete2"];
      if (isAdmin) return editableStatuses.includes(rv.status);
      if (isConsultor)
        return rv.consultorId === user.id && editableStatuses.includes(rv.status);
      return false;
    },

    canSendRV: (rv: RVReport) => {
      if (isAdmin) return rv.status === "rascunho";
      if (isConsultor)
        return (
          rv.consultorId === user.id &&
          (rv.status === "rascunho" || rv.status === "enviado")
        );
      return false;
    },

    canViewAvaliacaoConsultor: !isDealer,

    canManageDomains: isAdmin,

    canViewAllRVs: isGerenteRegional || isAdmin,

    canSignRV: perfil === "operador",

    canAccessAdmin: isAdmin,

    canViewAgendamentos:
      isConsultor || isAdmin || isGerenteRegional,

    canDeclineVisit: isConsultor || isAdmin,

    canAddToOutlook: !isDealer,

    showConsultorColumn: isGerenteRegional || isAdmin,

    showConsultorFilter: isGerenteRegional || isAdmin,
  };
}

export function filterRVsByProfile(
  rvs: RVReport[],
  user: User
): RVReport[] {
  switch (user.perfil) {
    case "consultor":
      return rvs.filter((rv) => rv.consultorId === user.id);
    case "gerente_regional":
      return rvs;
    case "admin":
      return rvs;
    case "operador":
    case "gerente_dealer":
      return rvs.filter((rv) => rv.dealerId === user.dealerId);
    default:
      return [];
  }
}

export const PROFILE_LABELS: Record<UserProfile, string> = {
  consultor: "Consultor",
  gerente_regional: "Gerente Regional",
  admin: "Administrador",
  operador: "Operador (Dealer)",
  gerente_dealer: "Gerente do Dealer",
};

export const PROFILE_COLORS: Record<UserProfile, string> = {
  consultor: "#324380",
  gerente_regional: "#D59D05",
  admin: "#D80030",
  operador: "#4E9B3D",
  gerente_dealer: "#03B4C6",
};

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import {
  RVReport,
  ScheduledVisit,
  DomainOption,
  SignatureSession,
} from "@/lib/types";
import { mockRVReports } from "@/lib/mocks/rvReports";
import { mockScheduledVisits } from "@/lib/mocks/scheduledVisits";
import {
  mockFocusOptions,
  mockModalityOptions,
} from "@/lib/mocks/domainOptions";
import { mockSignatureSessions } from "@/lib/mocks/signatureSessions";

interface RVContextValue {
  rvReports: RVReport[];
  setRVReports: React.Dispatch<React.SetStateAction<RVReport[]>>;
  addRV: (rv: RVReport) => void;
  updateRV: (id: string, updates: Partial<RVReport>) => void;

  scheduledVisits: ScheduledVisit[];
  setScheduledVisits: React.Dispatch<React.SetStateAction<ScheduledVisit[]>>;
  addScheduledVisit: (visit: ScheduledVisit) => void;
  updateScheduledVisit: (id: string, updates: Partial<ScheduledVisit>) => void;

  focusOptions: DomainOption[];
  setFocusOptions: React.Dispatch<React.SetStateAction<DomainOption[]>>;

  modalityOptions: DomainOption[];
  setModalityOptions: React.Dispatch<React.SetStateAction<DomainOption[]>>;

  signatureSessions: SignatureSession[];
  setSignatureSessions: React.Dispatch<React.SetStateAction<SignatureSession[]>>;
  updateSignatureSession: (
    token: string,
    updates: Partial<SignatureSession>
  ) => void;
}

const RVContext = createContext<RVContextValue | null>(null);

export function RVProvider({ children }: { children: React.ReactNode }) {
  const [rvReports, setRVReports] = useState<RVReport[]>(mockRVReports);
  const [scheduledVisits, setScheduledVisits] =
    useState<ScheduledVisit[]>(mockScheduledVisits);
  const [focusOptions, setFocusOptions] =
    useState<DomainOption[]>(mockFocusOptions);
  const [modalityOptions, setModalityOptions] =
    useState<DomainOption[]>(mockModalityOptions);
  const [signatureSessions, setSignatureSessions] =
    useState<SignatureSession[]>(mockSignatureSessions);

  const addRV = useCallback((rv: RVReport) => {
    setRVReports((prev) => [rv, ...prev]);
  }, []);

  const updateRV = useCallback((id: string, updates: Partial<RVReport>) => {
    setRVReports((prev) =>
      prev.map((rv) => (rv.id === id ? { ...rv, ...updates } : rv))
    );
  }, []);

  const addScheduledVisit = useCallback((visit: ScheduledVisit) => {
    setScheduledVisits((prev) => [visit, ...prev]);
  }, []);

  const updateScheduledVisit = useCallback(
    (id: string, updates: Partial<ScheduledVisit>) => {
      setScheduledVisits((prev) =>
        prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
      );
    },
    []
  );

  const updateSignatureSession = useCallback(
    (token: string, updates: Partial<SignatureSession>) => {
      setSignatureSessions((prev) =>
        prev.map((s) => (s.token === token ? { ...s, ...updates } : s))
      );
    },
    []
  );

  return (
    <RVContext.Provider
      value={{
        rvReports,
        setRVReports,
        addRV,
        updateRV,
        scheduledVisits,
        setScheduledVisits,
        addScheduledVisit,
        updateScheduledVisit,
        focusOptions,
        setFocusOptions,
        modalityOptions,
        setModalityOptions,
        signatureSessions,
        setSignatureSessions,
        updateSignatureSession,
      }}
    >
      {children}
    </RVContext.Provider>
  );
}

export function useRVContext() {
  const ctx = useContext(RVContext);
  if (!ctx) throw new Error("useRVContext must be used within RVProvider");
  return ctx;
}

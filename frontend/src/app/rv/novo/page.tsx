"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { RVForm } from "@/components/rv/RVForm";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePermissions } from "@/hooks/usePermissions";

export default function NovoRVPage() {
  const { currentUser } = useCurrentUser();
  const permissions = usePermissions(currentUser);

  if (!permissions.canCreateRV) {
    return (
      <div className="py-12 text-center">
        <p className="text-[#555] font-medium text-sm mb-1">Acesso restrito</p>
        <p className="text-[#aaa] text-xs">Seu perfil não pode criar relatórios de visita.</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Novo Relatório de Visita"
        subtitle="Preencha as informações da visita realizada"
        actions={
          <Link href="/rv" className="btn-secondary">
            <ArrowLeft size={14} /> Voltar
          </Link>
        }
      />
      <RVForm mode="create" />
    </>
  );
}

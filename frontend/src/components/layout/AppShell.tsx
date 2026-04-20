"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  FileText,
  Calendar,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePermissions } from "@/hooks/usePermissions";
import { PROFILE_LABELS } from "@/lib/permissions";
import { ProfileSwitcher } from "./ProfileSwitcher";

const navItems = [
  { href: "/rv", label: "Relatórios de Visita", icon: FileText, exact: false },
  { href: "/rv/agendamentos", label: "Agendamentos", icon: Calendar, exact: true },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hideTopbar = searchParams.get("hideTopbar") === "true";

  const { currentUser } = useCurrentUser();
  const permissions = usePermissions(currentUser);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSidebarOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    if (href === "/rv") {
      return (
        pathname === "/rv" ||
        (pathname.startsWith("/rv") &&
          !pathname.startsWith("/rv/agendamentos") &&
          !pathname.startsWith("/rv/admin"))
      );
    }
    return pathname.startsWith(href);
  };

  const visibleNavItems = navItems.filter((item) => {
    if (item.href === "/rv/agendamentos") return permissions.canViewAgendamentos;
    return true;
  });

  return (
    <div className="flex flex-col min-h-0 overflow-visible bg-white">
      {/* Topbar — identidade Nissan em vermelho, mais compacta */}
      {!hideTopbar && (
        <header className="flex-none h-11 bg-[#D80030] flex items-center px-3 gap-2 z-40 border-b border-[#B5022A]">
          <button
            className="lg:hidden text-white/80 hover:text-white p-1"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-white font-semibold text-sm tracking-tight select-none">
              SerNissan
            </span>
            <span className="text-white/40 text-xs">·</span>
            <span className="hidden sm:block text-white/70 text-xs truncate">
              Relatório de Visita
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <div className="hidden sm:block text-right">
              <p className="text-white text-xs font-medium leading-tight">{currentUser.nome}</p>
              <p className="text-white/60 text-[10px] leading-tight">{PROFILE_LABELS[currentUser.perfil]}</p>
            </div>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-[10px] font-semibold border border-white/25">
              {currentUser.avatarInitials}
            </div>
          </div>
        </header>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar — branca, compacta, sem sombra pesada */}
        <aside
          className={cn(
            "sidebar-transition flex-none bg-white border-r border-[#E8E8E8] z-30 flex flex-col w-[196px]",
            "fixed lg:relative inset-y-0 left-0 h-full",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          {/* Mobile close */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#E8E8E8] lg:hidden">
            <span className="text-[#444] font-medium text-sm">Menu</span>
            <button onClick={() => setSidebarOpen(false)} className="text-[#999] hover:text-[#444]">
              <X size={16} />
            </button>
          </div>

          <nav className="flex-1 py-2 overflow-y-auto">
            <div className="space-y-px px-1">
              {visibleNavItems.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 text-xs rounded-sm transition-colors relative",
                      active
                        ? "bg-[#F5F5F5] text-[#333] font-medium"
                        : "text-[#666] hover:bg-[#F8F8F8] hover:text-[#333]"
                    )}
                  >
                    {/* Active indicator */}
                    {active && (
                      <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-[#D80030] rounded-r" />
                    )}
                    <item.icon size={14} className={active ? "text-[#D80030]" : "text-[#999]"} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}

              {permissions.canAccessAdmin && (
                <Link
                  href="/rv/admin"
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 text-xs rounded-sm transition-colors relative",
                    isActive("/rv/admin", true)
                      ? "bg-[#F5F5F5] text-[#333] font-medium"
                      : "text-[#666] hover:bg-[#F8F8F8] hover:text-[#333]"
                  )}
                >
                  {isActive("/rv/admin", true) && (
                    <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-[#D80030] rounded-r" />
                  )}
                  <Settings size={14} className={isActive("/rv/admin", true) ? "text-[#D80030]" : "text-[#999]"} />
                  <span className="truncate">Administração</span>
                </Link>
              )}
            </div>
          </nav>

          {/* Profile footer */}
          <div className="px-3 py-2 border-t border-[#E8E8E8]">
            <p className="text-[11px] text-[#888] truncate">{currentUser.nome}</p>
            <p className="text-[10px] text-[#bbb] truncate">{PROFILE_LABELS[currentUser.perfil]}</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-[#FAFAFA]">
          <div className="max-w-[1400px] mx-auto px-4 py-4">
            {children}
          </div>
        </main>
      </div>

      <ProfileSwitcher />
    </div>
  );
}

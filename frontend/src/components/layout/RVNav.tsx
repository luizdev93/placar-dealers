"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Calendar, Settings } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePermissions } from "@/hooks/usePermissions";

const navItems = [
  { href: "/rv", label: "Relatórios de Visita", icon: FileText },
  { href: "/rv/agendamentos", label: "Agendamentos", icon: Calendar },
];

export function RVNav() {
  const pathname = usePathname();
  const { currentUser } = useCurrentUser();
  const permissions = usePermissions(currentUser);

  const isActive = (href: string) => {
    if (href === "/rv") {
      return (
        pathname === "/rv" ||
        (pathname.startsWith("/rv/") &&
          !pathname.startsWith("/rv/agendamentos") &&
          !pathname.startsWith("/rv/admin"))
      );
    }
    return pathname.startsWith(href);
  };

  const visibleItems = navItems.filter((item) => {
    if (item.href === "/rv/agendamentos") return permissions.canViewAgendamentos;
    return true;
  });

  const allItems = [
    ...visibleItems,
    ...(permissions.canAccessAdmin
      ? [{ href: "/rv/admin", label: "Admin", icon: Settings }]
      : []),
  ];

  return (
    <div className="rv-nav" style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {allItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              fontSize: 14,
              fontWeight: 600,
              color: active ? "#000000" : "#616161",
              textDecoration: "none",
              borderBottom: active ? "2px solid #000000" : "2px solid transparent",
              marginBottom: -1,
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              if (!active) (e.currentTarget as HTMLAnchorElement).style.color = "#000000";
            }}
            onMouseLeave={(e) => {
              if (!active) (e.currentTarget as HTMLAnchorElement).style.color = "#616161";
            }}
          >
            <item.icon size={15} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

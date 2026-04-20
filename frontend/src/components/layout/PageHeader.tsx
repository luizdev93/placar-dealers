import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5", className)}>
      <div>
        {/* Título: 32px, weight 900, #000000, line-height 1.2 */}
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "#000000", lineHeight: 1.2, margin: 0 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 12, color: "#9e9e9e", marginTop: 4, fontWeight: 400 }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", flexShrink: 0, paddingTop: 4 }}>
          {actions}
        </div>
      )}
    </div>
  );
}

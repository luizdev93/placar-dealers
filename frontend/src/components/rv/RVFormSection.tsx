import React from "react";
import { cn } from "@/lib/utils";

interface RVFormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function RVFormSection({ title, description, children, className }: RVFormSectionProps) {
  return (
    <div className={cn("bubble-card", className)} style={{ marginBottom: 14 }}>
      <div style={{ marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid #eeeeee" }}>
        {/* Label: 14px, 600, #616161 */}
        <h2 style={{ fontSize: 14, fontWeight: 600, color: "#616161", margin: 0 }}>{title}</h2>
        {description && (
          <p style={{ fontSize: 12, color: "#9e9e9e", marginTop: 2 }}>{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

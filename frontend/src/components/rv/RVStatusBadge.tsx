import React from "react";
import { RVStatus } from "@/lib/types";
import { statusConfig } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface RVStatusBadgeProps {
  status: RVStatus;
  size?: "sm" | "md";
  className?: string;
}

export function RVStatusBadge({ status, size = "md", className }: RVStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(config.badgeClass, className)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 12,
        fontWeight: 400,
        borderRadius: 4,
        padding: size === "sm" ? "2px 7px" : "3px 9px",
        whiteSpace: "nowrap",
        lineHeight: 1.4,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          backgroundColor: config.dotColor,
          flexShrink: 0,
        }}
      />
      {config.label}
    </span>
  );
}

"use client";

import React, { useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { PROFILE_LABELS, PROFILE_COLORS } from "@/lib/permissions";
import { UserProfile } from "@/lib/types";
import { ChevronUp, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProfileSwitcher() {
  const { currentUser, setCurrentUser, allUsers } = useCurrentUser();
  const [open, setOpen] = useState(false);

  const profilesByType = allUsers.reduce((acc, user) => {
    if (!acc[user.perfil]) acc[user.perfil] = [];
    acc[user.perfil].push(user);
    return acc;
  }, {} as Record<UserProfile, typeof allUsers>);

  return (
    <div className="fixed bottom-3 right-3 z-50">
      {open && (
        <div className="mb-1.5 bg-white border border-[#E8E8E8] overflow-hidden w-56 shadow-lg">
          <div className="bg-[#F2F2F2] border-b border-[#E8E8E8] px-2.5 py-1.5">
            <p className="text-[10px] font-semibold text-[#666] uppercase tracking-wide">Trocar perfil (mock)</p>
          </div>
          <div className="p-1 max-h-72 overflow-y-auto">
            {(Object.entries(profilesByType) as [UserProfile, typeof allUsers][]).map(([perfil, users]) => (
              <div key={perfil}>
                <p className="text-[9px] font-semibold text-[#bbb] px-2 pt-1.5 pb-0.5 uppercase tracking-wide">{PROFILE_LABELS[perfil]}</p>
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => { setCurrentUser(user); setOpen(false); }}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1 text-left transition-colors text-[12px]",
                      currentUser.id === user.id ? "bg-[#f1f1f1] text-[#000000]" : "hover:bg-[#F8F8F8] text-[#444]"
                    )}
                  >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-none" style={{ backgroundColor: PROFILE_COLORS[perfil] }}>
                      {user.avatarInitials}
                    </div>
                    <span className="truncate">{user.nome}</span>
                    {currentUser.id === user.id && <span className="ml-auto text-[9px] text-[#000000] font-bold">✓</span>}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 text-white text-[11px] font-medium transition-all shadow",
          open ? "bg-[#333333]" : "bg-[#000000] hover:bg-[#333333]"
        )}
      >
        <User size={12} />
        <span className="hidden sm:inline">{PROFILE_LABELS[currentUser.perfil]}</span>
        <ChevronUp size={10} className={cn("transition-transform", open ? "" : "rotate-180")} />
      </button>
    </div>
  );
}

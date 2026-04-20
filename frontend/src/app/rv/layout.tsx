import React, { Suspense } from "react";
import { CurrentUserProvider } from "@/contexts/CurrentUserContext";
import { RVProvider } from "@/contexts/RVContext";
import { IframeMessenger } from "@/components/layout/IframeMessenger";
import { IframeAutoHeight } from "@/components/layout/IframeAutoHeight";
import { RVNav } from "@/components/layout/RVNav";
import { ProfileSwitcher } from "@/components/layout/ProfileSwitcher";

export default function RVLayout({ children }: { children: React.ReactNode }) {
  return (
    <CurrentUserProvider>
      <RVProvider>
        <IframeMessenger />
        <Suspense fallback={null}>
          <IframeAutoHeight />
          <div className="rv-content">
            <RVNav />
            {children}
          </div>
          <ProfileSwitcher />
        </Suspense>
      </RVProvider>
    </CurrentUserProvider>
  );
}

import React, { Suspense } from "react";
import { CurrentUserProvider } from "@/contexts/CurrentUserContext";
import { RVProvider } from "@/contexts/RVContext";
import { IframeMessenger } from "@/components/layout/IframeMessenger";
import { RVNav } from "@/components/layout/RVNav";

export default function RVLayout({ children }: { children: React.ReactNode }) {
  return (
    <CurrentUserProvider>
      <RVProvider>
        <IframeMessenger />
        <Suspense fallback={null}>
          <div className="rv-content">
            <RVNav />
            {children}
          </div>
        </Suspense>
      </RVProvider>
    </CurrentUserProvider>
  );
}

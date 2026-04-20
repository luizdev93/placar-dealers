"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

/** Enviado ao parent (ex.: Bubble) para ajustar altura do HTML Element / iframe */
export const RV_IFRAME_HEIGHT_MESSAGE = "RV_CONTENT_HEIGHT" as const;

/** Margem inferior para não cortar o ProfileSwitcher fixo e toasts */
const BOTTOM_SAFE_PX = 80;

function getDocumentHeight(): number {
  const doc = document.documentElement;
  const body = document.body;
  return Math.max(
    doc.scrollHeight,
    doc.offsetHeight,
    body.scrollHeight,
    body.offsetHeight,
    doc.clientHeight,
  );
}

/**
 * Dentro de um iframe: evita scroll interno (altura = conteúdo) e avisa o pai da altura.
 * No Bubble, escute window message com type === RV_CONTENT_HEIGHT e aplique height no elemento.
 */
export function IframeAutoHeight() {
  const pathname = usePathname();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const postHeight = useCallback(() => {
    if (typeof window === "undefined" || window.parent === window) return;
    const height = getDocumentHeight() + BOTTOM_SAFE_PX;
    window.parent.postMessage(
      {
        type: RV_IFRAME_HEIGHT_MESSAGE,
        height,
        path: pathname,
        source: "placar-rv",
      },
      "*",
    );
  }, [pathname]);

  const schedulePost = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = undefined;
      requestAnimationFrame(() => {
        requestAnimationFrame(postHeight);
      });
    }, 60);
  }, [postHeight]);

  useEffect(() => {
    const embedded = typeof window !== "undefined" && window.parent !== window;
    if (!embedded) return;

    document.documentElement.classList.add("rv-embed");
    document.body.classList.add("rv-embed");

    const ro = new ResizeObserver(schedulePost);
    ro.observe(document.documentElement);
    ro.observe(document.body);

    schedulePost();
    const t1 = window.setTimeout(schedulePost, 150);
    const t2 = window.setTimeout(schedulePost, 500);

    window.addEventListener("load", schedulePost);

    return () => {
      document.documentElement.classList.remove("rv-embed");
      document.body.classList.remove("rv-embed");
      ro.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("load", schedulePost);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [schedulePost]);

  useEffect(() => {
    schedulePost();
  }, [pathname, schedulePost]);

  return null;
}

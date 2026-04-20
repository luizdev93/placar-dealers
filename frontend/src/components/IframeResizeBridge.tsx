"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
} from "react";

function maxScrollHeight(): number {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
  );
}

function IframeResizeBridgeInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const rafCoalesce = useRef(false);
  /** Timer id (DOM retorna number; tipos Node usam Timeout — unificado no cleanup). */
  const mutationDebounce = useRef<number | undefined>(undefined);

  const sendHeight = useCallback(() => {
    if (typeof window === "undefined" || window.parent === window) return;
    if (rafCoalesce.current) return;
    rafCoalesce.current = true;
    requestAnimationFrame(() => {
      rafCoalesce.current = false;
      const height = maxScrollHeight();
      window.parent.postMessage({ type: "resize", height }, "*");
    });
  }, []);

  const scheduleDelayedSends = useCallback(() => {
    sendHeight();
    const t50 = window.setTimeout(sendHeight, 50);
    const t200 = window.setTimeout(sendHeight, 200);
    const t500 = window.setTimeout(sendHeight, 500);
    return () => {
      window.clearTimeout(t50);
      window.clearTimeout(t200);
      window.clearTimeout(t500);
    };
  }, [sendHeight]);

  useEffect(() => {
    if (typeof window === "undefined" || window.parent === window) return;

    document.documentElement.classList.add("rv-embed");
    document.body.classList.add("rv-embed");

    const onResizeOrLoad = () => sendHeight();
    window.addEventListener("resize", onResizeOrLoad);
    window.addEventListener("load", onResizeOrLoad);

    const ro = new ResizeObserver(() => sendHeight());
    ro.observe(document.body);
    ro.observe(document.documentElement);

    const onMutation = () => {
      if (mutationDebounce.current) clearTimeout(mutationDebounce.current);
      mutationDebounce.current = window.setTimeout(() => {
        mutationDebounce.current = undefined;
        sendHeight();
      }, 80) as number;
    };
    const mo = new MutationObserver(onMutation);
    mo.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    const clearDelays = scheduleDelayedSends();

    return () => {
      document.documentElement.classList.remove("rv-embed");
      document.body.classList.remove("rv-embed");
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", onResizeOrLoad);
      window.removeEventListener("load", onResizeOrLoad);
      clearDelays();
      if (mutationDebounce.current) clearTimeout(mutationDebounce.current);
    };
  }, [sendHeight, scheduleDelayedSends]);

  useEffect(() => {
    if (window.parent === window) return;
    const clearDelays = scheduleDelayedSends();
    return clearDelays;
  }, [pathname, searchKey, scheduleDelayedSends]);

  return null;
}

export function IframeResizeBridge() {
  return (
    <Suspense fallback={null}>
      <IframeResizeBridgeInner />
    </Suspense>
  );
}

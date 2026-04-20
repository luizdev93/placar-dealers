import { useEffect, useRef, useState, useCallback } from "react";

type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

export function useAutoSave<T>(
  data: T,
  key: string,
  delay = 3000
): { status: AutoSaveStatus; lastSaved: Date | null; forceSave: () => void } {
  const [status, setStatus] = useState<AutoSaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevDataRef = useRef<string>("");

  const doSave = useCallback(
    (currentData: T) => {
      setStatus("saving");
      setTimeout(() => {
        try {
          if (typeof window !== "undefined") {
            localStorage.setItem(
              `rv-draft-${key}`,
              JSON.stringify({ data: currentData, savedAt: new Date().toISOString() })
            );
          }
          setStatus("saved");
          setLastSaved(new Date());
        } catch {
          setStatus("error");
        }
      }, 800);
    },
    [key]
  );

  useEffect(() => {
    const serialized = JSON.stringify(data);
    if (serialized === prevDataRef.current) return;
    prevDataRef.current = serialized;

    if (timerRef.current) clearTimeout(timerRef.current);
    setStatus("idle");

    timerRef.current = setTimeout(() => {
      doSave(data);
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data, delay, doSave]);

  const forceSave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    doSave(data);
  }, [data, doSave]);

  return { status, lastSaved, forceSave };
}

"use client";

import { useEffect } from "react";

/**
 * IframeMessenger — prepara comunicação via postMessage com o Bubble.
 * Nesta fase apenas ouve mensagens. Na integração real, processará comandos
 * como: { type: "SET_USER", payload: { userId, profile, dealerId } }
 */
export function IframeMessenger() {
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      // Em produção: validar event.origin antes de processar
      if (!event.data || typeof event.data !== "object") return;

      const { type, payload } = event.data;

      switch (type) {
        case "SET_PROFILE":
          // Futuro: trocar perfil automaticamente via query param ou context
          console.log("[IframeMessenger] SET_PROFILE recebido:", payload);
          break;
        case "SET_DEALER":
          // Futuro: filtrar por dealer automaticamente
          console.log("[IframeMessenger] SET_DEALER recebido:", payload);
          break;
        case "PING":
          // Responder que o microfront está ativo
          event.source?.postMessage({ type: "PONG", from: "rv-module" }, {
            targetOrigin: event.origin,
          });
          break;
        default:
          break;
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return null;
}

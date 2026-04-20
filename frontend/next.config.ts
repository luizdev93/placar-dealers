import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Pasta do app Next (`frontend/`). */
const appDir = path.dirname(fileURLToPath(import.meta.url));
/** Raiz do repositório Git — Next 16 exige o mesmo valor em outputFileTracingRoot e turbopack.root. */
const monorepoRoot = path.join(appDir, "..");

const nextConfig: NextConfig = {
  outputFileTracingRoot: monorepoRoot,
  turbopack: {
    root: monorepoRoot,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Embed no Bubble: CSP (ALLOWALL não é valor válido de X-Frame-Options)
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

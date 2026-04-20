This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

Este repositório é um monorepo: o app Next.js fica na pasta **`frontend/`**, não na raiz.

1. No painel Vercel: **Project → Settings → General → Root Directory** → defina **`frontend`** e salve.
2. **Framework Preset:** deve permanecer **Next.js** (detectado pelo `package.json` dentro de `frontend`).
3. Faça um **Redeploy** (Deployments → ⋮ → Redeploy).

Sem o Root Directory em `frontend`, a Vercel usa a raiz do Git (só documentação + pasta `frontend`), o build fica vazio ou genérico (~segundos) e qualquer rota pode responder **404 NOT_FOUND** — não é falta de rota no Next.js, e sim o app não ter sido implantado a partir da pasta certa.

O script `npm run build` usa **`next build --webpack`**: com `package.json` também na raiz do monorepo, o Turbopack do Next 16 pode inferir a raiz errada e falhar o build; o webpack evita isso na Vercel e em CI.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

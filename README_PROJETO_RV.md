# Projeto RV — Frontend Mockado para Embed no Bubble

## Objetivo
Criar o **frontend do módulo Relatório de Visita (RV)** como um **microfront externo**, com foco inicial em **layout, UX, responsividade e fidelidade visual ao app atual em Bubble**, usando **dados mockados**.

A primeira entrega **não deve implementar backend real**, banco, autenticação real, IA real, envio de e-mails, assinatura real ou integração com Bubble. O objetivo é entregar um front navegável, convincente e pronto para ser embutido via iframe no Bubble.

---

## Fontes da verdade do projeto
Na pasta do projeto existirão dois arquivos principais:

- `sernissan-15044.bubble` → export do app atual em Bubble, usado para entender a identidade visual, estrutura visual, padrões de UI, nomenclatura e possíveis entidades já existentes.
- `RV_Especificacao_Funcional.docx` → documento funcional oficial do módulo RV. É a principal referência de regras, telas, campos, fluxos e restrições.

---

## Objetivo desta fase
Entregar um microfront com:

- visual consistente com o sistema atual
- navegação entre telas
- dados mockados realistas
- regras visuais por perfil
- telas de demonstração do fluxo do RV
- pronto para ser publicado na Vercel
- pronto para abrir dentro do Bubble via iframe

---

## Escopo desta fase

### Incluir
- design system baseado no Bubble
- layout responsivo
- rotas do módulo RV
- componentes reutilizáveis
- mocks completos
- interações visuais simuladas
- modais, badges, estados, feedbacks
- comportamento visual por perfil
- tela pública de ciência/assinatura mobile-first

### Não incluir nesta fase
- integração com banco
- APIs reais
- autenticação real
- upload real
- gravação de áudio real
- OpenAI/Whisper/GPT reais
- assinatura digital real
- hash SHA-256 real
- geração real de ICS
- envio de e-mails real
- automações temporizadas
- logs imutáveis

---

## Stack recomendada
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui ou componentes próprios
- deploy na Vercel

---

## Estratégia de implementação
1. Ler o `.docx` e transformar em mapa de telas, entidades e fluxos.
2. Ler o `.bubble` e extrair a linguagem visual do app.
3. Criar tokens visuais do sistema.
4. Criar componentes-base.
5. Criar mocks estruturados.
6. Montar as telas principais.
7. Adicionar interações visuais fake.
8. Ajustar responsividade.
9. Deixar pronto para embed no Bubble.

---

## Resultado esperado
Ao final desta fase, o usuário deve conseguir:
- abrir o microfront localmente
- navegar pelas telas do módulo RV
- trocar cenários mockados
- ver o comportamento por perfil
- incorporar em um iframe do Bubble
- validar visualmente que o módulo tem a mesma linguagem do app principal

---

## Critérios de sucesso
- aparência coerente com o Bubble
- sem sensação de “sistema externo genérico”
- fluxo principal demonstrável
- mobile bom na tela pública de ciência
- arquitetura de front organizada para permitir integração posterior

---

## Publicação na Vercel (quando aparece 404 ou “Ready Stale”)

O código Next.js está em **`frontend/`**. Se a Vercel usar só a raiz do Git, o build não gera o app (build de poucos segundos) e o site mostra **404: NOT_FOUND**. O painel pode ficar em **Ready Stale** ligado a um **commit antigo** enquanto os deploys novos falham no GitHub (X vermelho).

**Checklist (faça nesta ordem):**

1. **Vercel** → projeto **placar-dealers** → **Settings** → **General** → **Root Directory** → **Edit** → digite exatamente **`frontend`** → **Save**.
2. **Settings** → **General** → **Node.js Version** → use **20.x** ou **22.x** (Next 16).
3. **Deployments** → abra o deploy com **falha** (último commit da `main`) → **Build Logs** → se aparecer erro, copie as últimas linhas (para suporte).
4. **Deployments** → nos três pontos do último deploy → **Redeploy** → desmarque **“Use existing Build Cache”** → confirmar.
5. Abra **`https://<seu-projeto>.vercel.app/`** — deve redirecionar para **`/rv`**.

No repositório, o workflow **CI frontend** (GitHub Actions) roda `npm ci` e `npm run build` em `frontend/`. Se o ícone verde aparecer no GitHub e a Vercel ainda falhar, o problema é só configuração do projeto na Vercel (passos 1–2).


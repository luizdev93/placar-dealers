# 📂 ESTRUTURA DE PASTAS — FRONT RV

## Stack esperada
- Next.js
- React
- Tailwind

---

## 📁 Estrutura

/src
  /app
    /rv
      page.tsx
      /novo
        page.tsx
      /[id]
        page.tsx
      /agendamentos
        page.tsx
      /admin
        page.tsx
      /ciencia
        /[token]
          page.tsx

  /components
    /ui
      Button.tsx
      Input.tsx
      Select.tsx
      Modal.tsx
      Badge.tsx
      Card.tsx

    /rv
      RVForm.tsx
      RVHeader.tsx
      RVParticipants.tsx
      RVSteps.tsx
      RVTimeline.tsx
      RVAttachments.tsx
      RVList.tsx

  /lib
    mockData.ts
    types.ts
    utils.ts

  /styles
    globals.css

---

## 🎯 Regras

- Componentizar ao máximo
- Separar UI de lógica
- Criar types desde o início
- Não misturar mock com componente diretamente
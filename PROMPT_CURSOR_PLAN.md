# Prompt para Cursor — Modo Plan

PRIORIDADE DE LEITURA:

1. ESPECIFICACAO_FRONT_RV.md (REGRAS)
2. MAPA_DE_TELAS.md (ESTRUTURA)
3. ESTRUTURA_DE_PASTAS.md (ARQUITETURA)
4. MOCK_DATA_SPEC.md (DADOS)
5. INSTRUCOES_LEITURA_BUBBLE.md (UI)
6. README_PROJETO_RV.md (CONTEXTO)
7. RV_Especificacao_Funcional.docx (REFERÊNCIA COMPLETA)
8. sernissan-15044.bubble (REFERÊNCIA VISUAL)

Use o prompt abaixo no Cursor em modo Plan.

---

Você está trabalhando em um projeto chamado **Placar_Dealers**.

Dentro desta pasta existem documentos que devem ser lidos antes de propor qualquer implementação:

1. `sernissan-15044.bubble`
2. `RV_Especificacao_Funcional.docx`
3. `README_PROJETO_RV.md`
4. `ESPECIFICACAO_FRONT_RV.md`

Sua tarefa nesta fase é **planejar e depois construir apenas o frontend mockado do módulo de Relatório de Visita (RV)**, sem backend real.

## Objetivo principal
Criar um microfront em **Next.js + React + TypeScript + Tailwind**, pronto para ser publicado na Vercel e embutido no Bubble via iframe, com **dados mockados** e **fidelidade visual ao app atual em Bubble**.

## Instruções obrigatórias

### 1. Antes de gerar qualquer código
- Leia os arquivos listados acima.
- Extraia do `.bubble` a linguagem visual do sistema atual.
- Extraia do `.docx` as regras funcionais, campos, perfis, fluxos e restrições.
- Use os arquivos `.md` como regra de implementação desta fase.

### 2. Não implemente backend real
Nesta etapa, não crie:
- integração com Bubble
- integração com banco
- autenticação real
- APIs reais
- upload real
- áudio real
- IA real
- e-mail real
- assinatura real
- hash real
- automações reais

Tudo deve ser visual e mockado, mas arquitetado para futura integração.

### 3. Entregáveis esperados
Você deve montar um plano de implementação e depois construir:
- design system baseado no Bubble
- rotas do módulo RV
- componentes reutilizáveis
- dados mockados estruturados
- telas principais
- interações visuais simuladas
- responsividade

### 4. Telas obrigatórias
Implemente as seguintes rotas/telas:
- `/rv`
- `/rv/novo`
- `/rv/[id]`
- `/rv/agendamentos`
- `/rv/admin`
- `/rv/ciencia/[token]`

### 5. Perfis obrigatórios
Crie um mecanismo simples para alternar mocks por perfil:
- Consultor
- Gerente Regional
- Admin
- Operador
- Gerente do Dealer

### 6. Regras obrigatórias
- O visual deve refletir o app atual do Bubble.
- A tela pública de ciência deve ser mobile-first.
- O campo “Avaliação do Consultor” nunca pode aparecer para perfis do Dealer.
- O fluxo deve parecer pronto para uso, mesmo sendo mockado.
- O código deve ficar organizado para integração futura.

### 7. Componentização obrigatória
Crie componentes reutilizáveis antes de montar todas as telas. Evite duplicação.

### 8. Mocks obrigatórios
Crie mocks ricos, com estados e cenários reais:
- RV em Rascunho
- RV em Enviado
- RV em Lembrete 1
- RV em Lembrete 2
- RV em Assinado
- RV em Expirado

### 9. Interações visuais que devem existir
Mesmo fake, implemente visualmente:
- autosave com horário
- modal de confirmação de envio
- upload com preview fake
- microfone fake no relato
- melhorar texto com diff lado a lado
- timeline/status do RV
- assinatura com comentário opcional
- tela de sucesso da ciência
- botão fake de adicionar ao Outlook

### 10. Forma de trabalho esperada
Quero que você trabalhe em etapas, nesta ordem:
1. mapear o sistema atual pelo `.bubble`
2. mapear os requisitos pelo `.docx`
3. propor arquitetura de pastas
4. propor design system
5. propor modelo de mocks
6. listar componentes
7. listar telas
8. implementar base visual
9. implementar mocks
10. implementar telas
11. refinar responsividade

### 11. Entrega esperada do plano
Antes do código, escreva um plano claro contendo:
- resumo do que foi entendido do Bubble
- resumo do que foi entendido do documento funcional
- estratégia de fidelidade visual
- arquitetura do frontend
- estrutura de pastas
- lista de componentes
- lista de mocks
- ordem de implementação
- riscos e cuidados

### 12. Qualidade esperada
Não quero um layout genérico. Quero um módulo que pareça pertencer ao sistema atual.

### 13. Resultado final desta fase
O resultado deve ser um frontend mockado, navegável, com boa UX, pronto para publicar na Vercel e embutir no Bubble via iframe.

Agora comece lendo toda a documentação da pasta e monte primeiro o plano completo antes de escrever o código.


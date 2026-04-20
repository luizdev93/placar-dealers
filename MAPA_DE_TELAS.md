# 🗺️ MAPA DE TELAS — Módulo RV

## Objetivo
Definir todas as telas do módulo Relatório de Visita (RV) com seus elementos e navegação.

---

## 🌐 Estrutura de Rotas

/rv
/rv/novo
/rv/[id]
/rv/agendamentos
/rv/admin
/rv/ciencia/[token]

---

## 📄 Tela: Lista de RVs (/rv)

### Elementos:
- Header (título + botão "Novo RV")
- Filtros:
  - Dealer
  - Consultor
  - Status
  - Período
- Tabela:
  - Dealer
  - Consultor
  - Data
  - Foco
  - Modalidade
  - Status (badge)
- Ações:
  - Ver detalhe
  - Editar (se permitido)

---

## ✍️ Tela: Criar/Editar RV (/rv/novo, /rv/[id])

### Seções:
1. Cabeçalho
2. Participantes
3. Relato
4. Destaques
5. Próximos passos
6. Avaliação do Consultor (oculto para Dealer)
7. Anexos

### Interações:
- Auto-save (mock)
- Upload com preview
- Botão “Melhorar texto”
- Botão “Gravar áudio”
- Botão “Enviar”

---

## 🔍 Tela: Detalhe do RV (/rv/[id])

### Elementos:
- Header com status
- Cards:
  - Informações gerais
  - Participantes
  - Relato
  - Próximos passos
  - Anexos
- Timeline de status

---

## 📱 Tela: Ciência (Dealer) (/rv/ciencia/[token])

### Mobile-first:

1. Identificação:
   - Nome do operador
   - Dealer

2. Conteúdo:
   - RV completo (sem Avaliação do Consultor)

3. Ação:
   - Campo comentário
   - Botão "Confirmar ciência"

---

## 📅 Tela: Agendamento (/rv/agendamentos)

- Lista de visitas futuras
- Criar nova visita
- Botão “Adicionar ao Outlook” (mock)

---

## 🛠️ Tela: Admin (/rv/admin)

- Filtros globais
- Tabela geral
- Gestão de:
  - Foco
  - Modalidade
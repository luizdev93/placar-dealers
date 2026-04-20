# Especificação do Front — Módulo Relatório de Visita (RV)

## 1. Visão geral
Este frontend representa o módulo de Relatório de Visita descrito no documento funcional. Nesta etapa, o foco é **UX + UI + mocks**, sem backend real.

O frontend deve ser pensado para futura integração com:
- Bubble como shell do sistema
- backend próprio do módulo RV
- leitura de dados existentes do Bubble

---

## 2. Princípios obrigatórios

### 2.1 Fidelidade visual
O frontend deve tentar reproduzir o app atual do Bubble em:
- paleta de cores
- tipografia
- espaçamentos
- botões
- inputs
- cards
- badges
- tabelas
- modais
- densidade visual

### 2.2 Responsividade
- Desktop como principal experiência de operação.
- Sem rolagem horizontal em telas a partir de 1280px.
- Mobile especialmente importante para a tela pública de ciência.

### 2.3 Separação de responsabilidades
Nesta fase, tudo deve ser construído de forma visual e mockada, mas já preparado para integração futura.

---

## 3. Perfis e visibilidade
Criar um mock de sessão que permita alternar entre os perfis:
- Consultor
- Gerente Regional
- Admin
- Operador
- Gerente do Dealer

### Regras visuais importantes
- Consultor vê criação/edição dos seus RVs.
- Gerente Regional vê visão agregada.
- Admin vê visão global e gestão de domínios.
- Operador acessa a tela de ciência.
- Gerente do Dealer pode aparecer como destinatário de cópia.
- O campo **Avaliação do Consultor nunca pode aparecer para Dealer**.

---

## 4. Telas obrigatórias

### 4.1 Lista de RVs
Objetivo: servir como entrada principal do módulo.

Elementos:
- título da página
- filtros visuais
- busca
- seletor de período
- tabela/lista de RVs
- badges de status
- CTA “Novo RV”
- acesso ao detalhe

Colunas sugeridas:
- Dealer
- Consultor
- Data
- Foco
- Modalidade
- Status
- Data da ciência

---

### 4.2 Formulário de criação/edição de RV
Campos obrigatórios baseados no documento funcional:
- Dealer
- Consultor
- Data da visita
- Horário de início
- Horário de fim
- Modalidade
- Foco da visita
- Participantes do Dealer
- Relato da visita
- Pontos de destaque
- Próximos passos
- Avaliação do Consultor
- Anexos

#### UX necessária
- agrupamento por seções
- ações de salvar rascunho
- ação de enviar
- modal de confirmação antes de enviar
- indicador fake de autosave
- botão fake de microfone
- botão fake de “Melhorar texto”
- diff lado a lado para sugestão de IA
- upload com preview fake

---

### 4.3 Detalhe do RV
Blocos sugeridos:
- cabeçalho com status
- resumo da visita
- participantes
- relato
- pontos de destaque
- próximos passos
- anexos
- comentários de ciência
- linha do tempo/status

Regras:
- mostrar visualmente quando está bloqueado por assinatura
- esconder Avaliação do Consultor nas visões Dealer

---

### 4.4 Tela pública de ciência/assinatura
Essa é uma das telas mais importantes.

Deve ser mobile-first.

Fluxo visual:
1. cabeçalho simples com identidade do sistema
2. confirmação visual de quem está assinando
3. exibição do RV sem Avaliação do Consultor
4. campo opcional de comentário
5. botão “Confirmar ciência”
6. tela de sucesso com código/hash fake

Requisitos de UX:
- leitura clara no celular
- botões grandes
- até 3 toques para concluir
- aparência confiável, leve e oficial

---

### 4.5 Agendamento de visita
Objetivo: representar a funcionalidade de visitas futuras.

Elementos:
- lista de visitas agendadas
- CTA de novo agendamento
- formulário de agendamento
- ação fake “Adicionar ao Outlook”
- ação de declinar visita com justificativa

---

### 4.6 Painel Admin
Objetivo: representar visão global e gestão de domínio.

Elementos:
- filtros globais
- tabela/lista global de RVs
- gestão das listas “Foco” e “Modalidade”
- ações visuais de adicionar, editar e desativar item
- indicadores simples

---

## 5. Estados do RV que precisam existir nos mocks
Criar mocks com pelo menos os seguintes status:
- Rascunho
- Enviado
- Lembrete 1
- Lembrete 2
- Assinado
- Expirado

Esses estados precisam ter:
- badge visual
- cor consistente
- comportamento visual coerente

---

## 6. Dados mockados necessários
Criar arquivos de mock com estrutura próxima da futura estrutura real.

### Entidades sugeridas
- `currentUser`
- `users`
- `dealers`
- `rvReports`
- `rvParticipants`
- `rvNextSteps`
- `rvAttachments`
- `scheduledVisits`
- `domainFocusOptions`
- `domainModalityOptions`
- `signatureSessions`

### Cenários mínimos
Criar pelo menos:
- 6 RVs em status diferentes
- 3 dealers
- 5 usuários com perfis diversos
- 2 visitas agendadas
- 1 exemplo de assinatura concluída
- 1 exemplo pendente

---

## 7. Componentes recomendados
Criar componentes reutilizáveis para:
- app shell do módulo
- page header
- stat cards
- badges de status
- filtros
- data table/list
- form section
- field wrapper
- multiline rich text fake
- participants repeater
- next steps table
- upload area
- attachment preview
- timeline/status tracker
- modal de confirmação
- split diff viewer
- mobile signature card

---

## 8. Navegação recomendada
Estrutura de rotas sugerida:
- `/rv`
- `/rv/novo`
- `/rv/[id]`
- `/rv/agendamentos`
- `/rv/admin`
- `/rv/ciencia/[token]`

---

## 9. Embed no Bubble
O frontend deve ser preparado para abrir dentro de um iframe.

Considerações:
- largura total
- fundo consistente
- altura confortável
- sem cabeçalho redundante se não for necessário
- idealmente preparado para receber query params futuros

Exemplos de query params futuros:
- `userId`
- `profile`
- `dealerId`
- `theme`
- `env`

Nesta fase, podem ser ignorados funcionalmente, mas a estrutura pode ser prevista.

---

## 10. O que NÃO deve acontecer
- Não criar visual genérico de dashboard SaaS sem relação com o Bubble.
- Não ignorar a restrição do campo Avaliação do Consultor.
- Não construir fluxo desktop-only para ciência.
- Não criar telas sem estado vazio, loading fake e erro fake.
- Não deixar o código desorganizado a ponto de travar a integração futura.

---

## 11. Critérios de aceite do front
O front será considerado correto quando:
- o layout refletir visualmente o sistema atual
- as telas principais do módulo existirem
- os fluxos mockados forem navegáveis
- o módulo puder ser embutido por iframe
- a tela pública de ciência estiver boa no mobile
- os perfis alterarem a visibilidade corretamente


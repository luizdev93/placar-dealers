import { SignatureSession } from "@/lib/types";

export const mockSignatureSessions: SignatureSession[] = [
  {
    token: "tok_rv002_abc123",
    rvId: "rv_002",
    operadorId: "user_4",
    dealerId: "dealer_2",
    status: "pendente",
  },
  {
    token: "tok_rv003_def456",
    rvId: "rv_003",
    operadorId: "user_4",
    dealerId: "dealer_3",
    status: "pendente",
  },
  {
    token: "tok_rv005_jkl012",
    rvId: "rv_005",
    operadorId: "user_4",
    dealerId: "dealer_5",
    status: "assinado",
    dataAssinatura: "2026-03-13T14:22:00Z",
    hashFake: "RV-005-SHA#A3F2C1D8",
    comentario:
      "Confirmo as informações apresentadas. As melhorias no processo de gestão de estoque foram fundamentais para os resultados deste trimestre.",
  },
  {
    token: "tok_rv006_mno345",
    rvId: "rv_006",
    operadorId: "user_5",
    dealerId: "dealer_1",
    status: "pendente",
  },
];

export const getSessionByToken = (
  token: string
): SignatureSession | undefined =>
  mockSignatureSessions.find((s) => s.token === token);

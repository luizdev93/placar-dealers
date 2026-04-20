import { Dealer } from "@/lib/types";

export const mockDealers: Dealer[] = [
  {
    id: "dealer_1",
    nome: "Nissan Centro",
    cidade: "São Paulo",
    estado: "SP",
    cnpj: "12.345.678/0001-90",
    regiao: "Sudeste",
  },
  {
    id: "dealer_2",
    nome: "Nissan Norte",
    cidade: "Manaus",
    estado: "AM",
    cnpj: "23.456.789/0001-01",
    regiao: "Norte",
  },
  {
    id: "dealer_3",
    nome: "Nissan Sul",
    cidade: "Curitiba",
    estado: "PR",
    cnpj: "34.567.890/0001-12",
    regiao: "Sul",
  },
  {
    id: "dealer_4",
    nome: "Nissan Leste",
    cidade: "Belo Horizonte",
    estado: "MG",
    cnpj: "45.678.901/0001-23",
    regiao: "Sudeste",
  },
  {
    id: "dealer_5",
    nome: "Nissan Oeste",
    cidade: "Campo Grande",
    estado: "MS",
    cnpj: "56.789.012/0001-34",
    regiao: "Centro-Oeste",
  },
];

export const getMockDealerById = (id: string): Dealer | undefined =>
  mockDealers.find((d) => d.id === id);

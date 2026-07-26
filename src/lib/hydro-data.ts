export type Country = "BR" | "FR";

export interface CityRain {
  name: string;
  country: Country;
  /** Intensidade pluviométrica de projeto (mm/h) */
  i: number;
}

export const CITIES: CityRain[] = [
  // Brasil — NBR 10844 (T = 5 anos, t = 5 min)
  { name: "Porto Alegre", country: "BR", i: 156.0 },
  { name: "São Paulo", country: "BR", i: 172.0 },
  { name: "Rio de Janeiro", country: "BR", i: 183.0 },
  { name: "Belo Horizonte", country: "BR", i: 167.0 },
  { name: "Curitiba", country: "BR", i: 148.0 },
  { name: "Florianópolis", country: "BR", i: 144.0 },
  { name: "Brasília", country: "BR", i: 165.0 },
  { name: "Goiânia", country: "BR", i: 178.0 },
  { name: "Salvador", country: "BR", i: 138.0 },
  { name: "Recife", country: "BR", i: 152.0 },
  { name: "Fortaleza", country: "BR", i: 160.0 },
  { name: "Natal", country: "BR", i: 142.0 },
  { name: "João Pessoa", country: "BR", i: 145.0 },
  { name: "Maceió", country: "BR", i: 149.0 },
  { name: "Aracaju", country: "BR", i: 141.0 },
  { name: "Teresina", country: "BR", i: 158.0 },
  { name: "São Luís", country: "BR", i: 154.0 },
  { name: "Belém", country: "BR", i: 186.0 },
  { name: "Manaus", country: "BR", i: 180.0 },
  { name: "Macapá", country: "BR", i: 174.0 },
  { name: "Boa Vista", country: "BR", i: 132.0 },
  { name: "Porto Velho", country: "BR", i: 170.0 },
  { name: "Rio Branco", country: "BR", i: 163.0 },
  { name: "Palmas", country: "BR", i: 157.0 },
  { name: "Cuiabá", country: "BR", i: 169.0 },
  { name: "Campo Grande", country: "BR", i: 161.0 },
  { name: "Vitória", country: "BR", i: 155.0 },
  { name: "Campinas", country: "BR", i: 164.0 },
  { name: "Santos", country: "BR", i: 176.0 },
  { name: "Ribeirão Preto", country: "BR", i: 159.0 },
  { name: "São José dos Campos", country: "BR", i: 151.0 },
  { name: "Sorocaba", country: "BR", i: 150.0 },
  { name: "Bauru", country: "BR", i: 147.0 },
  { name: "Londrina", country: "BR", i: 146.0 },
  { name: "Maringá", country: "BR", i: 143.0 },
  { name: "Foz do Iguaçu", country: "BR", i: 139.0 },
  { name: "Joinville", country: "BR", i: 137.0 },
  { name: "Blumenau", country: "BR", i: 140.0 },
  { name: "Chapecó", country: "BR", i: 135.0 },
  { name: "Caxias do Sul", country: "BR", i: 133.0 },
  { name: "Pelotas", country: "BR", i: 129.0 },
  { name: "Santa Maria", country: "BR", i: 131.0 },
  { name: "Uberlândia", country: "BR", i: 162.0 },
  { name: "Juiz de Fora", country: "BR", i: 153.0 },
  { name: "Montes Claros", country: "BR", i: 166.0 },
  { name: "Feira de Santana", country: "BR", i: 136.0 },
  { name: "Petrolina", country: "BR", i: 128.0 },
  { name: "Campina Grande", country: "BR", i: 134.0 },
  { name: "Niterói", country: "BR", i: 179.0 },
  // França — DTU 60.11
  { name: "Paris", country: "FR", i: 72.0 },
  { name: "Lyon", country: "FR", i: 78.0 },
  { name: "Marseille", country: "FR", i: 88.0 },
  { name: "Toulouse", country: "FR", i: 74.0 },
  { name: "Nice", country: "FR", i: 96.0 },
  { name: "Nantes", country: "FR", i: 70.0 },
  { name: "Strasbourg", country: "FR", i: 68.0 },
  { name: "Montpellier", country: "FR", i: 92.0 },
  { name: "Bordeaux", country: "FR", i: 76.0 },
  { name: "Lille", country: "FR", i: 64.0 },
  { name: "Rennes", country: "FR", i: 66.0 },
  { name: "Reims", country: "FR", i: 63.0 },
  { name: "Le Havre", country: "FR", i: 65.0 },
  { name: "Saint-Étienne", country: "FR", i: 80.0 },
  { name: "Toulon", country: "FR", i: 94.0 },
  { name: "Grenoble", country: "FR", i: 82.0 },
  { name: "Dijon", country: "FR", i: 69.0 },
  { name: "Angers", country: "FR", i: 67.0 },
  { name: "Nîmes", country: "FR", i: 90.0 },
];

export interface Fixture {
  peca: string;
  qtd: number;
  /** peso relativo unitário NBR 5626 */
  peso: number;
  dn: number;
  /** unidades Hunter de contribuição NBR 8160 */
  uhc: number;
}

export const FIXTURES: Fixture[] = [
  { peca: "Bacia sanitária c/ caixa acoplada", qtd: 4, peso: 0.3, dn: 25, uhc: 6 },
  { peca: "Lavatório", qtd: 4, peso: 0.5, dn: 20, uhc: 1 },
  { peca: "Chuveiro / Ducha higiênica", qtd: 3, peso: 0.4, dn: 20, uhc: 2 },
  { peca: "Pia de cozinha", qtd: 1, peso: 0.7, dn: 20, uhc: 3 },
  { peca: "Tanque de lavanderia", qtd: 1, peso: 0.7, dn: 20, uhc: 3 },
  { peca: "Máquina de lavar roupa", qtd: 1, peso: 1.0, dn: 20, uhc: 3 },
  { peca: "Torneira de jardim", qtd: 2, peso: 0.4, dn: 20, uhc: 0 },
];

export const fmt = (n: number, d = 2) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

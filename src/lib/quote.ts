import { company } from "@/data/company";
export type Interest = {
  id: string;
  category: string;
  product: string;
  quantity: string;
  unit: string;
};
export type Answers = {
  categories: string[];
  needsGuidance: boolean;
  projectStage: string;
  details: string;
  city: string;
  district: string;
  delivery: string;
  timing: string;
  notes: string;
  name: string;
  business: string;
};
export const emptyAnswers: Answers = {
  categories: [],
  needsGuidance: false,
  projectStage: "",
  details: "",
  city: "",
  district: "",
  delivery: "",
  timing: "",
  notes: "",
  name: "",
  business: "",
};
export const projectStages = [
  "Fundação",
  "Estrutura",
  "Laje",
  "Reforma ou ampliação",
  "Reposição de materiais",
  "Estou planejando",
];
export const timingOptions = [
  "Assim que possível",
  "Nesta semana",
  "Nas próximas semanas",
  "Estou planejando",
];
export const quoteCta = "Quero cotar no WhatsApp";

export function quoteMessage(a: Answers, items: Interest[]) {
  const selectedCategories = [
    ...new Set([...a.categories, ...items.map((item) => item.category)]),
  ];
  return [
    "Olá, HLS Ferragens! Quero cotar os materiais da minha obra.",
    a.name.trim() && `Nome: ${a.name.trim()}`,
    a.business.trim() && `Empresa: ${a.business.trim()}`,
    a.projectStage && `Etapa da obra: ${a.projectStage}`,
    selectedCategories.length > 0 &&
      `Categorias: ${selectedCategories.join(", ")}`,
    a.needsGuidance &&
      "Preciso de orientação para escolher materiais e medidas.",
    items.length > 0 &&
      `Lista de interesse:\n${items.map((i) => `• ${i.product} — ${i.quantity || "a definir"}${i.unit ? ` ${i.unit}` : ""}`).join("\n")}`,
    a.details.trim() && `Materiais / medidas: ${a.details.trim()}`,
    [a.city.trim(), a.district.trim()].some(Boolean) &&
      `Local: ${[a.city.trim(), a.district.trim()].filter(Boolean).join(" / ")}`,
    a.delivery && `Recebimento: ${a.delivery}`,
    a.timing && `Quando preciso: ${a.timing}`,
    a.notes.trim() && `Observações: ${a.notes.trim()}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}
export const quoteUrl = (a: Answers, items: Interest[]) =>
  `${company.whatsapp}?text=${encodeURIComponent(quoteMessage(a, items))}`;
export function validateStep(step: number, a: Answers, count: number): string {
  if (
    step === 0 &&
    !a.categories.length &&
    !count &&
    !a.needsGuidance &&
    !a.details.trim()
  )
    return "Selecione uma categoria, descreva o material ou escolha a opção de orientação.";
  if (step === 1 && (!a.city.trim() || !a.delivery))
    return "Informe a cidade e escolha entrega ou retirada.";
  if (step === 1 && !a.timing) return "Selecione quando precisa dos materiais.";
  if (step === 2 && !a.name.trim()) return "Informe como podemos chamar você.";
  return "";
}
export function invalidQuantity(quantity: string) {
  return (
    !quantity ||
    !Number.isFinite(Number(quantity)) ||
    Number(quantity) <= 0 ||
    Number(quantity) > 999999
  );
}

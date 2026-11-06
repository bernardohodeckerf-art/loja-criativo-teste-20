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
  details: "",
  city: "",
  district: "",
  delivery: "",
  timing: "",
  notes: "",
  name: "",
  business: "",
};
export function quoteMessage(a: Answers, items: Interest[]) {
  return [
    "Olá, HLS! Gostaria de solicitar um orçamento.",
    `Nome: ${a.name.trim()}`,
    a.business.trim() && `Empresa: ${a.business.trim()}`,
    a.categories.length && `Categorias: ${a.categories.join(", ")}`,
    items.length &&
      `Lista de interesse:\n${items.map((i) => `• ${i.product} — ${i.quantity || "a definir"} ${i.unit || ""}`).join("\n")}`,
    a.details.trim() && `Materiais / medidas: ${a.details.trim()}`,
    [a.city.trim(), a.district.trim()].filter(Boolean).length &&
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
  if (step === 0 && !a.categories.length && !count)
    return "Selecione uma categoria ou adicione um produto à lista.";
  if (step === 1 && !count && !a.details.trim())
    return "Descreva o material que procura. Você pode pedir orientação sobre medidas.";
  if (step === 2 && (!a.city.trim() || !a.delivery))
    return "Informe a cidade e escolha entrega ou retirada.";
  if (step === 3 && !a.timing) return "Selecione quando precisa dos materiais.";
  if (step === 4 && !a.name.trim()) return "Informe como podemos chamar você.";
  return "";
}

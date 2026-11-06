import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  Trash2,
  X,
} from "lucide-react";
import categories from "@/data/catalog.json";
import {
  emptyAnswers,
  quoteMessage,
  quoteUrl,
  validateStep,
  type Answers,
  type Interest,
} from "@/lib/quote";
const titles = [
  "O que você precisa?",
  "Materiais e quantidades.",
  "Onde fica sua obra?",
  "Quando precisa?",
  "Como podemos chamar você?",
  "Tudo certo por aqui?",
];
export function Quote({
  open,
  onClose,
  items,
  setItems,
}: {
  open: boolean;
  onClose: () => void;
  items: Interest[];
  setItems: React.Dispatch<React.SetStateAction<Interest[]>>;
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    heading = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState(0),
    [answers, setAnswers] = useState<Answers>(emptyAnswers),
    [error, setError] = useState("");
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      document.body.style.overflow = "hidden";
      heading.current?.focus();
    } else if (!open && el.open) el.close();
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  useEffect(() => {
    if (open) heading.current?.focus();
  }, [step, open]);
  const field = (name: keyof Answers, value: string) => {
    setAnswers((a) => ({ ...a, [name]: value }));
    setError("");
  };
  function next() {
    const invalidQuantity =
      step === 1 &&
      items.some(
        (i) =>
          !i.quantity ||
          !Number.isFinite(Number(i.quantity)) ||
          Number(i.quantity) <= 0 ||
          Number(i.quantity) > 999999,
      );
    const err = invalidQuantity
      ? "Informe quantidades maiores que zero e até 999999."
      : validateStep(step, answers, items.length);
    setError(err);
    if (err)
      requestAnimationFrame(() =>
        document.getElementById("quote-error")?.focus(),
      );
    else setStep((s) => Math.min(5, s + 1));
  }
  const textField = (
    name: Exclude<keyof Answers, "categories">,
    label: string,
    required = false,
  ) => (
    <label className="field" key={name}>
      {label}
      {required ? " *" : ""}
      <input
        name={name}
        value={answers[name]}
        onChange={(e) => field(name, e.target.value)}
        maxLength={name === "name" ? 100 : 200}
        required={required}
        aria-invalid={!!error && required}
        aria-describedby={error && required ? "quote-error" : undefined}
        autoComplete={
          name === "name"
            ? "name"
            : name === "city"
              ? "address-level2"
              : name === "business"
                ? "organization"
                : "off"
        }
      />
    </label>
  );
  return (
    <dialog
      ref={dialog}
      className="quote-dialog"
      aria-labelledby="quote-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onClose={onClose}
    >
      <div className="quote-inner">
        <div className="dialog-top">
          <p className="eyebrow">
            ORÇAMENTO RÁPIDO · {Math.min(step + 1, 5)} / 5
          </p>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Fechar orçamento"
          >
            <X />
          </button>
        </div>
        <progress
          value={step + 1}
          max={6}
          aria-label="Progresso do orçamento"
        />
        <h2 id="quote-title" ref={heading} tabIndex={-1}>
          {titles[step]}
        </h2>
        <p className="muted">
          {step === 5
            ? "Revise sua lista antes de continuar."
            : "Vamos preparar uma conversa com a HLS. Sem compromisso."}
        </p>
        {error && (
          <p className="error" id="quote-error" role="alert" tabIndex={-1}>
            {error}
          </p>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            next();
          }}
          noValidate
        >
          {step === 0 && (
            <fieldset aria-describedby={error ? "quote-error" : undefined}>
              <legend className="sr-only">
                Selecione uma ou mais categorias
              </legend>
              <div className="category-options">
                {categories.map((c) => (
                  <label
                    className={
                      answers.categories.includes(c.name) ? "selected" : ""
                    }
                    key={c.id}
                  >
                    <input
                      type="checkbox"
                      checked={answers.categories.includes(c.name)}
                      onChange={() => {
                        setAnswers((a) => ({
                          ...a,
                          categories: a.categories.includes(c.name)
                            ? a.categories.filter((n) => n !== c.name)
                            : [...a.categories, c.name],
                        }));
                        setError("");
                      }}
                    />
                    {c.name}
                    <Check size={15} />
                  </label>
                ))}
              </div>
              <p className="muted">
                Pode escolher mais de uma. Não sabe a medida? Nossa equipe
                orienta você.
              </p>
            </fieldset>
          )}
          {step === 1 && (
            <>
              <div className="interest-list">
                {!items.length && (
                  <p className="muted">
                    Você também pode selecionar produtos no catálogo.
                  </p>
                )}
                {items.map((item) => (
                  <div className="interest-item" key={item.id}>
                    <p>
                      {item.product}
                      <small>{item.category}</small>
                    </p>
                    <label>
                      Quantidade
                      <input
                        aria-label={`Quantidade de ${item.product}`}
                        aria-invalid={!!error && (!item.quantity || Number(item.quantity) <= 0 || Number(item.quantity) > 999999)}
                        aria-describedby={error ? "quote-error" : undefined}
                        type="number"
                        min="0.01"
                        max="999999"
                        step="any"
                        value={item.quantity}
                        onChange={(e) =>
                          setItems((list) =>
                            list.map((i) =>
                              i.id === item.id
                                ? { ...i, quantity: e.target.value }
                                : i,
                            ),
                          )
                        }
                      />
                    </label>
                    <label>
                      Unidade
                      <select
                        aria-label={`Unidade de ${item.product}`}
                        value={item.unit}
                        onChange={(e) =>
                          setItems((list) =>
                            list.map((i) =>
                              i.id === item.id
                                ? { ...i, unit: e.target.value }
                                : i,
                            ),
                          )
                        }
                      >
                        <option value="">A definir</option>
                        {[
                          "un.",
                          "barras",
                          "kg",
                          "metros",
                          "rolos",
                          "telas",
                        ].map((u) => (
                          <option key={u}>{u}</option>
                        ))}
                      </select>
                    </label>
                    <button
                      className="icon-button"
                      type="button"
                      onClick={() =>
                        setItems((list) => list.filter((i) => i.id !== item.id))
                      }
                      aria-label={`Remover ${item.product}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
              </div>
              <label className="field">
                Materiais, medidas ou dúvidas{!items.length ? " *" : ""}
                <textarea
                  value={answers.details}
                  maxLength={1500}
                  rows={3}
                  onChange={(e) => field("details", e.target.value)}
                  aria-invalid={!!error}
                  aria-describedby={error ? "quote-error" : undefined}
                  placeholder="Ex.: preciso de aço para uma laje e ajuda para definir as medidas."
                />
              </label>
            </>
          )}
          {step === 2 && (
            <>
              {textField("city", "Cidade", true)}
              {textField("district", "Bairro (opcional)")}
              <fieldset>
                <legend>Como deseja receber? *</legend>
                <div className="radio-options">
                  {["Entrega", "Retirada"].map((v) => (
                    <label key={v}>
                      <input
                        type="radio"
                        name="delivery"
                        value={v}
                        checked={answers.delivery === v}
                        onChange={() => field("delivery", v)}
                        aria-describedby={error ? "quote-error" : undefined}
                      />
                      {v}
                    </label>
                  ))}
                </div>
              </fieldset>
              <p className="muted">
                Região atendida e condições de entrega serão confirmadas na
                conversa.
              </p>
            </>
          )}
          {step === 3 && (
            <>
              <fieldset>
                <legend>Previsão para sua obra *</legend>
                <div className="radio-options vertical">
                  {[
                    "Assim que possível",
                    "Nesta semana",
                    "Nas próximas semanas",
                    "Estou planejando",
                  ].map((v) => (
                    <label key={v}>
                      <input
                        type="radio"
                        name="timing"
                        checked={answers.timing === v}
                        onChange={() => field("timing", v)}
                        aria-describedby={error ? "quote-error" : undefined}
                      />
                      {v}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="field">
                Observação (opcional)
                <textarea
                  maxLength={1000}
                  rows={3}
                  value={answers.notes}
                  onChange={(e) => field("notes", e.target.value)}
                />
              </label>
            </>
          )}
          {step === 4 && (
            <>
              {textField("name", "Seu nome", true)}
              {textField("business", "Empresa (opcional)")}
              <p className="muted">
                Seus dados ficam apenas nesta página enquanto ela estiver
                aberta.
              </p>
            </>
          )}
          {step === 5 && (
            <>
              <pre className="quote-summary">
                {quoteMessage(answers, items)}
              </pre>
              <button
                type="button"
                className="text-link"
                onClick={() => setStep(0)}
              >
                Editar respostas <ArrowLeft size={16} />
              </button>
            </>
          )}
          <div className="quote-actions">
            {step > 0 ? (
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  setStep((s) => s - 1);
                  setError("");
                }}
              >
                <ArrowLeft size={16} /> Voltar
              </button>
            ) : (
              <span />
            )}
            {step < 5 ? (
              <button className="button primary" type="submit">
                Continuar <ArrowRight size={17} />
              </button>
            ) : (
              <a
                className="button primary"
                href={quoteUrl(answers, items)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Continuar no WhatsApp <ExternalLink size={17} />
              </a>
            )}
          </div>
          {step === 5 && (
            <p className="muted final-note">
              Você poderá revisar e enviar a mensagem no WhatsApp.
            </p>
          )}
        </form>
      </div>
    </dialog>
  );
}

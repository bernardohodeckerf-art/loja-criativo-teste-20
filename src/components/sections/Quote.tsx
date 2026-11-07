import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  MessageCircle,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import categories from "@/data/catalog.json";
import {
  emptyAnswers,
  invalidQuantity,
  projectStages,
  quoteCta,
  quoteMessage,
  quoteUrl,
  timingOptions,
  validateStep,
  type Answers,
  type Interest,
} from "@/lib/quote";

const titles = [
  "O que sua obra precisa?",
  "Onde e quando você precisa?",
  "Seu próximo passo com a HLS.",
];
const descriptions = [
  "Escolha os materiais. A HLS ajuda com as medidas que você ainda não souber.",
  "Conte onde fica a obra e sua previsão. A equipe confirma atendimento e condições com você.",
  "Como podemos chamar você? Confira o resumo antes de seguir para a conversa.",
];
const stepLabels = ["Materiais", "Sua obra", "Revisar"];

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
    heading = useRef<HTMLHeadingElement>(null),
    finalLink = useRef<HTMLAnchorElement>(null);
  const [step, setStep] = useState(0),
    [answers, setAnswers] = useState<Answers>(() => ({
      ...emptyAnswers,
      categories: [],
    })),
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
  function field(
    name: Exclude<keyof Answers, "categories" | "needsGuidance">,
    value: string,
  ) {
    setAnswers((a) => ({ ...a, [name]: value }));
    setError("");
  }
  function goTo(next: number) {
    setError("");
    setStep(next);
  }
  function showError(message: string) {
    setError(message);
    requestAnimationFrame(() =>
      document.getElementById("quote-error")?.focus(),
    );
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    advance();
  }
  function advance() {
    const quantityError =
      step === 0 && items.some((i) => invalidQuantity(i.quantity));
    const message = quantityError
      ? "Informe quantidades maiores que zero e até 999999."
      : validateStep(step, answers, items.length);
    if (message) return showError(message);
    if (step < 2) goTo(step + 1);
    else finalLink.current?.focus();
  }
  const canContinue =
    [0, 1, 2].every((index) => !validateStep(index, answers, items.length)) &&
    !items.some((i) => invalidQuantity(i.quantity));
  function guardFinalLink(event: React.MouseEvent<HTMLAnchorElement>) {
    const invalidStep = [0, 1, 2].find((index) =>
      validateStep(index, answers, items.length),
    );
    if (invalidStep !== undefined) {
      event.preventDefault();
      setStep(invalidStep);
      showError(validateStep(invalidStep, answers, items.length));
    }
  }
  const textField = (
    name: Exclude<keyof Answers, "categories" | "needsGuidance">,
    label: string,
    required = false,
  ) => (
    <label className="field" key={name}>
      {label}
      {required ? " *" : ""}
      <input
        name={name}
        value={answers[name]}
        onKeyDown={(event) => {
          if (event.key === "Enter" && step === 2) {
            event.preventDefault();
            advance();
          }
        }}
        onChange={(e) => field(name, e.target.value)}
        maxLength={name === "name" ? 100 : 200}
        required={required}
        aria-invalid={!!error && required && !answers[name].trim()}
        aria-describedby={
          error && required && !answers[name].trim() ? "quote-error" : undefined
        }
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
      aria-describedby="quote-description"
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
          <p className="eyebrow">HLS FERRAGENS · SUA OBRA EM 3 PASSOS</p>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Fechar orçamento"
          >
            <X />
          </button>
        </div>
        <ol className="quote-steps" aria-label="Etapas do miniquestionário">
          {stepLabels.map((label, i) => (
            <li
              key={label}
              aria-current={step === i ? "step" : undefined}
              className={i < step ? "is-complete" : ""}
            >
              <span>{i < step ? <Check size={13} /> : i + 1}</span>
              {label}
            </li>
          ))}
        </ol>
        <progress
          value={step + 1}
          max={3}
          aria-label="Progresso do orçamento"
        />
        <h2 id="quote-title" ref={heading} tabIndex={-1}>
          {titles[step]}
        </h2>
        <p className="muted" id="quote-description">
          {descriptions[step]}
        </p>
        {error && (
          <p className="error" id="quote-error" role="alert" tabIndex={-1}>
            {error}
          </p>
        )}
        <form onSubmit={submit} noValidate>
          {step === 0 && (
            <>
              <fieldset aria-describedby={error ? "quote-error" : undefined}>
                <legend>Quais materiais entram na sua lista?</legend>
                <div className="category-options">
                  {categories.map((c) => (
                    <label
                      key={c.id}
                      className={
                        answers.categories.includes(c.name) ? "selected" : ""
                      }
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
                <label
                  className={`quote-guidance ${answers.needsGuidance ? "selected" : ""}`}
                >
                  <input
                    type="checkbox"
                    aria-label="Preciso de orientação para escolher"
                    aria-describedby="quote-guidance-help"
                    checked={answers.needsGuidance}
                    onChange={(e) => {
                      setAnswers((a) => ({
                        ...a,
                        needsGuidance: e.target.checked,
                      }));
                      setError("");
                    }}
                  />
                  <span>
                    Preciso de orientação para escolher
                    <small id="quote-guidance-help">
                      Não sabe a bitola? Conte com a equipe HLS.
                    </small>
                  </span>
                </label>
              </fieldset>
              {!!items.length && (
                <div className="quote-list-block">
                  <div className="quote-list-heading">
                    <h3>Materiais que você já escolheu</h3>
                    <span role="status">
                      {items.length} {items.length === 1 ? "item" : "itens"}
                    </span>
                  </div>
                  <div className="interest-list">
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
                            type="number"
                            min="0.01"
                            max="999999"
                            step="any"
                            value={item.quantity}
                            aria-invalid={
                              !!error && invalidQuantity(item.quantity)
                            }
                            aria-describedby={error ? "quote-error" : undefined}
                            onChange={(e) => {
                              setItems((list) =>
                                list.map((i) =>
                                  i.id === item.id
                                    ? { ...i, quantity: e.target.value }
                                    : i,
                                ),
                              );
                              setError("");
                            }}
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
                            ].map((unit) => (
                              <option key={unit}>{unit}</option>
                            ))}
                          </select>
                        </label>
                        <button
                          className="icon-button"
                          type="button"
                          aria-label={`Remover ${item.product}`}
                          onClick={() => {
                            setItems((list) =>
                              list.filter((i) => i.id !== item.id),
                            );
                            setError("");
                          }}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="field">
                <label htmlFor="quote-project-stage">
                  Etapa da obra (opcional)
                </label>
                <select
                  id="quote-project-stage"
                  value={answers.projectStage}
                  onChange={(e) => field("projectStage", e.target.value)}
                >
                  <option value="">Escolha se quiser</option>
                  {projectStages.map((stage) => (
                    <option key={stage}>{stage}</option>
                  ))}
                </select>
              </div>
              <label className="field">
                Medidas, quantidades ou dúvidas (opcional)
                <textarea
                  value={answers.details}
                  rows={2}
                  maxLength={1500}
                  onChange={(e) => field("details", e.target.value)}
                  placeholder="Ex.: aço para a laje. Ainda preciso confirmar as bitolas."
                  aria-describedby={error ? "quote-error" : undefined}
                />
              </label>
            </>
          )}
          {step === 1 && (
            <>
              <div className="quote-field-grid">
                {textField("city", "Cidade", true)}
                {textField("district", "Bairro (opcional)")}
              </div>
              <fieldset>
                <legend>Como deseja receber? *</legend>
                <div className="radio-options">
                  {["Entrega", "Retirada"].map((value) => (
                    <label key={value}>
                      <input
                        type="radio"
                        name="delivery"
                        value={value}
                        checked={answers.delivery === value}
                        onChange={() => field("delivery", value)}
                        aria-describedby={error ? "quote-error" : undefined}
                      />
                      {value}
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend>Quando precisa dos materiais? *</legend>
                <div className="radio-options vertical">
                  {timingOptions.map((value) => (
                    <label key={value}>
                      <input
                        type="radio"
                        name="timing"
                        value={value}
                        checked={answers.timing === value}
                        onChange={() => field("timing", value)}
                        aria-describedby={error ? "quote-error" : undefined}
                      />
                      {value}
                    </label>
                  ))}
                </div>
              </fieldset>
              <p className="quote-consult-note">
                <CheckCircle2 size={17} />
                Região atendida, prazo, disponibilidade e condições de entrega
                são confirmados pela HLS na conversa.
              </p>
              <details className="quote-extra">
                <summary>Adicionar uma observação (opcional)</summary>
                <label className="field">
                  Observação para a equipe
                  <textarea
                    rows={2}
                    maxLength={1000}
                    value={answers.notes}
                    onChange={(e) => field("notes", e.target.value)}
                  />
                </label>
              </details>
            </>
          )}
          {step === 2 && (
            <>
              <div className="quote-field-grid">
                {textField("name", "Seu nome", true)}
                {textField("business", "Empresa (opcional)")}
              </div>
              <div className="quote-review-heading">
                <div>
                  <p className="eyebrow">SUA CONVERSA JÁ COMEÇA ORGANIZADA</p>
                  <h3>Confira o que vamos levar à HLS</h3>
                </div>
                <CheckCircle2 size={22} />
              </div>
              <pre className="quote-summary">
                {quoteMessage(answers, items)}
              </pre>
              <div className="quote-edit-actions">
                <button
                  type="button"
                  className="text-link"
                  onClick={() => goTo(0)}
                >
                  <Pencil size={14} />
                  Editar materiais
                </button>
                <button
                  type="button"
                  className="text-link"
                  onClick={() => goTo(1)}
                >
                  <Pencil size={14} />
                  Editar entrega
                </button>
              </div>
            </>
          )}
          <div className="quote-actions">
            {step > 0 ? (
              <button
                type="button"
                className="button secondary"
                onClick={() => goTo(step - 1)}
              >
                <ArrowLeft size={16} />
                Voltar
              </button>
            ) : (
              <span className="quote-no-obligation">Sem compromisso.</span>
            )}
            {step < 2 ? (
              <button className="button primary" type="submit">
                Continuar
                <ArrowRight size={17} />
              </button>
            ) : canContinue ? (
              <a
                ref={finalLink}
                className="button primary quote-final-cta"
                href={quoteUrl(answers, items)}
                onClick={guardFinalLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {quoteCta}
                <MessageCircle size={18} />
              </a>
            ) : (
              <button className="button primary quote-final-cta" type="submit">
                {quoteCta}
                <MessageCircle size={18} />
              </button>
            )}
          </div>
          {step === 2 ? (
            <p className="muted final-note">
              Você poderá revisar e enviar a mensagem no WhatsApp.
            </p>
          ) : (
            <p className="quote-data-note">
              Suas respostas ficam nesta página até você decidir continuar no
              WhatsApp.
            </p>
          )}
        </form>
      </div>
    </dialog>
  );
}

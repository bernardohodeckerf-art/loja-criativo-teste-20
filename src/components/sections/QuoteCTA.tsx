import { ArrowUpRight, Check, MessageCircle } from "lucide-react";

export function QuoteCTA({ onQuote }: { onQuote: () => void }) {
  return (
    <section
      className="quote-invitation container"
      aria-labelledby="quote-invitation-title"
    >
      <div className="quote-invitation-copy">
        <p className="eyebrow light">FEITO PARA SUA OBRA · HLS FERRAGENS</p>
        <h2 id="quote-invitation-title">
          O material certo.
          <br />
          <em>O próximo passo é seu.</em>
        </h2>
        <p>
          Do aço da estrutura aos pregos do acabamento, conte o que precisa. A
          equipe HLS ajuda a conferir medidas e preparar seu orçamento.
        </p>
        <ul>
          <li>
            <Check size={16} />
            Sua lista do catálogo já vai junto.
          </li>
          <li>
            <Check size={16} />
            Não sabe a bitola? Peça orientação.
          </li>
          <li>
            <Check size={16} />
            Atendimento direto com a HLS no WhatsApp.
          </li>
        </ul>
      </div>
      <div className="quote-invitation-panel">
        <div className="quote-invitation-icon">
          <MessageCircle size={24} />
          <span>3 passos. Uma conversa mais fácil.</span>
        </div>
        <h3>
          Vamos preparar
          <br />o orçamento da sua obra?
        </h3>
        <ol>
          <li>
            <span>01</span>
            <div>
              <strong>O que você precisa</strong>
              <p>Materiais, medidas ou ajuda para escolher.</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <strong>Onde e quando</strong>
              <p>Cidade, entrega ou retirada e sua previsão.</p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <strong>Revisar e conversar</strong>
              <p>Seu nome e a lista pronta para o WhatsApp.</p>
            </div>
          </li>
        </ol>
        <button className="button primary" onClick={onQuote}>
          Quero cotar minha obra <ArrowUpRight size={19} />
        </button>
        <p className="quote-invitation-note">
          Sem cadastro. Sem compromisso.
          <br />
          Você revisa a mensagem antes de enviar.
        </p>
      </div>
    </section>
  );
}

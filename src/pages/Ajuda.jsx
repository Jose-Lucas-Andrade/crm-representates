import Card from "../components/ui/Card";

const topicos = [
  {
    titulo: "Primeiros passos",
    itens: [
      "Confirme o email cadastrado antes do primeiro login.",
      "Acesse a tela de clientes para começar a montar sua carteira.",
      "Defina status, classificação e próxima ação logo no cadastro.",
    ],
  },
  {
    titulo: "Como usar o CRM no dia a dia",
    itens: [
      "Use a tela Hoje para enxergar prioridades comerciais.",
      "Registre contatos sempre que falar com um cliente.",
      "Crie tarefas para propostas, visitas e retornos importantes.",
    ],
  },
  {
    titulo: "Boas práticas comerciais",
    itens: [
      "Atualize a próxima ação sempre que uma negociação avançar.",
      "Use a classificação Quente, Morno e Frio com consistência.",
      "Revise diariamente tarefas vencidas e clientes sem contato.",
    ],
  },
];

const perguntas = [
  {
    pergunta: "Não consigo entrar. O que devo verificar primeiro?",
    resposta:
      "Confirme se o email do cadastro já foi validado e se sua conta está com o acesso ativo.",
  },
  {
    pergunta: "Quando um cliente aparece no follow-up?",
    resposta:
      "Quando ele fica há 15 dias ou mais sem registro de contato, entrando na fila de retorno.",
  },
  {
    pergunta: "Qual a melhor forma de usar status e classificação?",
    resposta:
      "Use o status para representar a etapa comercial e a classificação para mostrar o calor da oportunidade.",
  },
  {
    pergunta: "Como evitar perder negociações?",
    resposta:
      "Mantenha sempre uma próxima ação definida e acompanhe a tela Hoje para não deixar clientes quentes esfriarem.",
  },
];

const onboarding = [
  "Cadastre os clientes principais da sua carteira.",
  "Classifique cada cliente como Quente, Morno ou Frio.",
  "Defina a próxima ação dos contatos mais importantes.",
  "Revise a tela Hoje no início do expediente.",
];

export default function Ajuda() {
  return (
    <div>
      <section style={styles.hero}>
        <div>
          <h1 style={styles.heroTitle}>Ajuda</h1>
          <p style={styles.heroText}>
            Um guia rápido para usar o CRM com mais fluidez no dia a dia
            comercial, desde o primeiro acesso até a rotina de follow-up.
          </p>
        </div>
      </section>

      <section style={styles.onboardingSection}>
        <Card>
          <h3 style={styles.sectionCardTitle}>Onboarding rápido</h3>
          <ol style={styles.orderedList}>
            {onboarding.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </Card>
      </section>

      <section style={styles.grid}>
        {topicos.map((topico) => (
          <Card key={topico.titulo}>
            <h3 style={styles.sectionCardTitle}>{topico.titulo}</h3>
            <ul style={styles.list}>
              {topico.itens.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
        ))}
      </section>

      <section>
        <h2 style={styles.faqTitle}>Perguntas frequentes</h2>
        <div style={styles.faqList}>
          {perguntas.map((item) => (
            <Card key={item.pergunta}>
              <h3 style={styles.question}>{item.pergunta}</h3>
              <p style={styles.answer}>{item.resposta}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

const styles = {
  hero: {
    marginBottom: 24,
    padding: "24px",
    borderRadius: "20px",
    background:
      "linear-gradient(135deg, rgba(22,163,74,0.12), rgba(59,130,246,0.08))",
    border: "1px solid rgba(22,163,74,0.16)",
  },
  heroTitle: {
    margin: "0 0 8px",
  },
  heroText: {
    margin: 0,
    color: "#475569",
    maxWidth: 720,
    lineHeight: 1.6,
  },
  onboardingSection: {
    marginBottom: 24,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 20,
    marginBottom: 28,
  },
  sectionCardTitle: {
    marginTop: 0,
    marginBottom: 12,
  },
  list: {
    margin: 0,
    paddingLeft: "18px",
    color: "#334155",
    lineHeight: 1.7,
  },
  orderedList: {
    margin: 0,
    paddingLeft: "20px",
    color: "#334155",
    lineHeight: 1.8,
  },
  faqTitle: {
    marginBottom: 16,
  },
  faqList: {
    display: "grid",
    gap: 14,
  },
  question: {
    marginTop: 0,
    marginBottom: 10,
  },
  answer: {
    margin: 0,
    color: "#475569",
    lineHeight: 1.6,
  },
};

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import {
  contatosHoje,
  obterResumo,
  tarefasPendentes,
  tarefasVencidas,
} from "../services/dashboard";
import { listarClientes } from "../services/clientes";
import { listarClientesSemContato } from "../services/followup";
import { CLIENTE_CLASSIFICACAO } from "../constants/clientes";

export default function Dashboard() {
  const [resumo, setResumo] = useState(null);
  const [contatos, setContatos] = useState(0);
  const [pendentes, setPendentes] = useState(0);
  const [vencidas, setVencidas] = useState(0);
  const [followups, setFollowups] = useState([]);
  const [clientesQuentes, setClientesQuentes] = useState([]);
  const [clientesSemAcao, setClientesSemAcao] = useState([]);

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      const [
        resumoData,
        contatosHojeTotal,
        tarefasPendentesTotal,
        tarefasVencidasTotal,
        listaFollowup,
        clientes,
      ] = await Promise.all([
        obterResumo(),
        contatosHoje(),
        tarefasPendentes(),
        tarefasVencidas(),
        listarClientesSemContato(15),
        listarClientes(),
      ]);

      if (!ativo) {
        return;
      }

      const listaClientes = clientes || [];

      setResumo(resumoData);
      setContatos(contatosHojeTotal);
      setPendentes(tarefasPendentesTotal);
      setVencidas(tarefasVencidasTotal);
      setFollowups((listaFollowup || []).slice(0, 4));
      setClientesQuentes(
        listaClientes
          .filter((cliente) => cliente.classificacao === CLIENTE_CLASSIFICACAO.QUENTE)
          .slice(0, 4)
      );
      setClientesSemAcao(
        listaClientes
          .filter((cliente) => !cliente.proxima_acao)
          .slice(0, 4)
      );
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, []);

  if (!resumo) {
    return <p>Carregando dashboard...</p>;
  }

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div>
          <h1 style={styles.heroTitle}>Dashboard</h1>
          <p style={styles.heroText}>
            Uma visão geral da operação comercial para entender o momento da carteira
            e identificar os principais pontos de atenção.
          </p>
        </div>
        <Link to="/hoje" style={styles.heroLink}>
          Ir para Hoje
        </Link>
      </section>

      <section style={styles.statsGrid}>
        <Card title="Prospects" value={resumo.prospects} />
        <Card title="Negociação" value={resumo.negociacao} />
        <Card title="Clientes" value={resumo.clientes} />
        <Card title="Inativos" value={resumo.inativos} />
        <Card title="Contatos hoje" value={contatos} />
        <Card title="Tarefas pendentes" value={pendentes} />
        <Card title="Tarefas vencidas" value={vencidas} />
      </section>

      <section style={styles.gridTwoColumns}>
        <div>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Saúde da carteira</h2>
            <p style={styles.sectionText}>
              Sinais rápidos de onde a carteira está pedindo atenção.
            </p>
          </div>

          <div style={styles.stack}>
            <Card>
              <p style={styles.metricLine}>
                <b>{followups.length}</b> cliente(s) com follow-up crítico na amostra.
              </p>
              <Link to="/alertas">Ver alertas</Link>
            </Card>

            <Card>
              <p style={styles.metricLine}>
                <b>{clientesSemAcao.length}</b> cliente(s) sem próxima ação definida.
              </p>
              <Link to="/clientes">Revisar clientes</Link>
            </Card>

            <Card>
              <p style={styles.metricLine}>
                <b>{clientesQuentes.length}</b> cliente(s) quentes em destaque.
              </p>
              <Link to="/clientes">Abrir carteira</Link>
            </Card>
          </div>
        </div>

        <div>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Resumo do momento</h2>
            <p style={styles.sectionText}>
              Uma leitura executiva do que está acontecendo agora.
            </p>
          </div>

          <div style={styles.stack}>
            <Card>
              <p style={styles.metricLine}>
                {vencidas > 0
                  ? `Você tem ${vencidas} tarefa(s) vencida(s) e ${pendentes} pendente(s) no total.`
                  : `Você tem ${pendentes} tarefa(s) pendente(s) e nenhuma vencida no momento.`}
              </p>
            </Card>

            <Card>
              <p style={styles.metricLine}>
                {contatos > 0
                  ? `${contatos} contato(s) já foram registrados hoje.`
                  : "Ainda não há contatos registrados hoje."}
              </p>
            </Card>

            <Card>
              <p style={styles.metricLine}>
                Use a tela <b>Hoje</b> para agir e a tela <b>Alertas</b> para acompanhar riscos.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Riscos em destaque</h2>
          <p style={styles.sectionText}>
            Uma amostra rápida dos pontos que mais pedem revisão da carteira.
          </p>
        </div>

        {followups.length === 0 ? (
          <Card>
            <p>Nenhum risco crítico apareceu na amostra atual.</p>
          </Card>
        ) : (
          <div style={styles.stack}>
            {followups.map((cliente) => (
              <Card key={cliente.cliente_id}>
                <b>{cliente.nome}</b>
                <p style={styles.metricLine}>
                  {cliente.dias} dias sem contato
                </p>
                <Link to={`/clientes/${cliente.cliente_id}`}>Abrir cliente</Link>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const styles = {
  page: {
    width: "100%",
    maxWidth: "1160px",
    margin: "0 auto",
  },
  hero: {
    marginBottom: 25,
    padding: "24px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, rgba(37,99,235,0.10), rgba(14,165,233,0.08))",
    border: "1px solid rgba(59,130,246,0.16)",
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  heroTitle: {
    margin: "0 0 6px",
  },
  heroText: {
    margin: 0,
    color: "#475569",
    maxWidth: 720,
    lineHeight: 1.6,
  },
  heroLink: {
    textDecoration: "none",
    fontWeight: "bold",
    padding: "10px 14px",
    borderRadius: "10px",
    background: "#dbeafe",
    color: "#1d4ed8",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 20,
    marginBottom: 36,
  },
  gridTwoColumns: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 24,
    marginBottom: 36,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    margin: "0 0 8px",
  },
  sectionText: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.6,
  },
  stack: {
    display: "grid",
    gap: 14,
  },
  metricLine: {
    margin: 0,
    color: "#475569",
    lineHeight: 1.6,
  },
};

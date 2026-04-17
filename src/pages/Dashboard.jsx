import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import { CLIENTE_CLASSIFICACAO, CLIENTE_STATUS } from "../constants/clientes";
import { listarClientes } from "../services/clientes";
import {
  contatosHoje,
  obterResumo,
  tarefasPendentes,
  tarefasVencidas,
} from "../services/dashboard";
import { listarClientesSemContato } from "../services/followup";

export default function Dashboard() {
  const [resumo, setResumo] = useState(null);
  const [contatos, setContatos] = useState(0);
  const [pendentes, setPendentes] = useState(0);
  const [vencidas, setVencidas] = useState(0);
  const [followups, setFollowups] = useState([]);
  const [clientesQuentes, setClientesQuentes] = useState([]);
  const [clientesQuentesSemAcao, setClientesQuentesSemAcao] = useState([]);
  const [clientesSemAcao, setClientesSemAcao] = useState([]);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const [
        resumoData,
        contatosData,
        pendentesData,
        vencidasData,
        followupData,
        clientesData,
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

      const clientes = clientesData || [];

      setResumo(resumoData);
      setContatos(contatosData || 0);
      setPendentes(pendentesData || 0);
      setVencidas(vencidasData || 0);
      setFollowups((followupData || []).slice(0, 4));
      setClientesQuentes(
        clientes
          .filter(
            (cliente) =>
              cliente.classificacao === CLIENTE_CLASSIFICACAO.QUENTE
          )
          .slice(0, 4)
      );
      setClientesQuentesSemAcao(
        clientes
          .filter(
            (cliente) =>
              cliente.classificacao === CLIENTE_CLASSIFICACAO.QUENTE &&
              !cliente.proxima_acao
          )
          .slice(0, 4)
      );
      setClientesSemAcao(
        clientes
          .filter(
            (cliente) =>
              cliente.status !== CLIENTE_STATUS.INATIVO && !cliente.proxima_acao
          )
          .slice(0, 4)
      );
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, []);

  const followupCritico = followups.length;
  const quentes = clientesQuentes.length;
  const semAcao = clientesSemAcao.length;

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div>
          <div style={styles.eyebrow}>Visão geral</div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>
            Entenda rapidamente a saúde da carteira, os gargalos do momento e
            os principais riscos comerciais antes de partir para a execução.
          </p>
        </div>

        <Link to="/hoje" style={styles.heroAction}>
          Ir para Hoje
        </Link>
      </section>

      <section style={styles.statsGrid}>
        <Card title="Prospects" value={resumo?.prospects ?? 0} />
        <Card title="Negociação" value={resumo?.negociacao ?? 0} />
        <Card title="Clientes" value={resumo?.clientes ?? 0} />
        <Card title="Inativos" value={resumo?.inativos ?? 0} />
        <Card title="Contatos hoje" value={contatos} />
        <Card title="Tarefas pendentes" value={pendentes} />
        <Card title="Tarefas vencidas" value={vencidas} />
      </section>

      <section style={styles.sectionGrid}>
        <Card>
          <h3 style={styles.sectionTitle}>Saúde da carteira</h3>
          <div style={styles.metricList}>
            <div style={styles.metricRow}>
              <span>Follow-up crítico</span>
              <strong>{followupCritico}</strong>
            </div>
            <div style={styles.metricRow}>
              <span>Sem próxima ação</span>
              <strong>{semAcao}</strong>
            </div>
            <div style={styles.metricRow}>
              <span>Quentes em destaque</span>
              <strong>{quentes}</strong>
            </div>
          </div>
        </Card>

        <Card>
          <h3 style={styles.sectionTitle}>Resumo do momento</h3>
          <div style={styles.summaryBlock}>
            <p style={styles.summaryLine}>
              Você tem <strong>{pendentes}</strong> tarefa(s) pendente(s) e{" "}
              <strong>{vencidas}</strong> vencida(s).
            </p>
            <p style={styles.summaryLine}>
              Hoje já foram registrados <strong>{contatos}</strong> contato(s).
            </p>
            <p style={styles.summaryHint}>
              Use a tela <strong>Hoje</strong> para agir e a tela{" "}
              <strong>Alertas</strong> para acompanhar riscos da carteira.
            </p>
          </div>
        </Card>
      </section>

      <section>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Riscos em destaque</h2>
            <p style={styles.sectionText}>
              Uma amostra curta do que merece atenção para a carteira não
              esfriar.
            </p>
          </div>
          <Link to="/alertas" style={styles.inlineLink}>
            Ver alertas
          </Link>
        </div>

        <div style={styles.riskGrid}>
          <Card>
            <h3 style={styles.cardTitle}>Sem contato há 15+ dias</h3>
            {followups.length === 0 ? (
              <p style={styles.emptyText}>Nenhum cliente crítico na amostra.</p>
            ) : (
              <div style={styles.stack}>
                {followups.map((cliente) => (
                  <Link
                    key={cliente.cliente_id}
                    to={`/clientes/${cliente.cliente_id}`}
                    style={styles.itemLink}
                  >
                    <span>{cliente.nome}</span>
                    <strong>{cliente.dias} dias</strong>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h3 style={styles.cardTitle}>Quentes sem próxima ação</h3>
            {clientesQuentesSemAcao.length === 0 ? (
              <p style={styles.emptyText}>Nenhum cliente quente em destaque.</p>
            ) : (
              <div style={styles.stack}>
                {clientesQuentesSemAcao.map((cliente) => (
                  <Link
                    key={cliente.id}
                    to={`/clientes/${cliente.id}`}
                    style={styles.itemLink}
                  >
                    <span>{cliente.nome}</span>
                    <strong>{cliente.proxima_acao || "Definir ação"}</strong>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h3 style={styles.cardTitle}>Sem próxima ação definida</h3>
            {clientesSemAcao.length === 0 ? (
              <p style={styles.emptyText}>Tudo em dia nesta amostra.</p>
            ) : (
              <div style={styles.stack}>
                {clientesSemAcao.map((cliente) => (
                  <Link
                    key={cliente.id}
                    to={`/clientes/${cliente.id}`}
                    style={styles.itemLink}
                  >
                    <span>{cliente.nome}</span>
                    <strong>{cliente.empresa || "Carteira ativa"}</strong>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  hero: {
    padding: "24px",
    borderRadius: "20px",
    border: "1px solid rgba(37,99,235,0.16)",
    background:
      "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(14,165,233,0.07))",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 16,
    flexWrap: "wrap",
  },
  eyebrow: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    background: "rgba(37,99,235,0.12)",
    color: "#1d4ed8",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  title: {
    margin: "0 0 8px",
  },
  subtitle: {
    margin: 0,
    maxWidth: 760,
    color: "#475569",
    lineHeight: 1.6,
  },
  heroAction: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 132,
    padding: "12px 16px",
    borderRadius: 12,
    background: "#2563eb",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 700,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: 16,
  },
  sectionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 16,
  },
  sectionTitle: {
    margin: "0 0 8px",
  },
  sectionText: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.6,
  },
  metricList: {
    display: "grid",
    gap: 12,
  },
  metricRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    color: "#334155",
  },
  summaryBlock: {
    display: "grid",
    gap: 10,
  },
  summaryLine: {
    margin: 0,
    color: "#334155",
    lineHeight: 1.6,
  },
  summaryHint: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.6,
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 16,
  },
  inlineLink: {
    fontWeight: 700,
    textDecoration: "none",
  },
  riskGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
  },
  cardTitle: {
    margin: "0 0 12px",
  },
  stack: {
    display: "grid",
    gap: 10,
  },
  itemLink: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    padding: "12px 14px",
    borderRadius: 12,
    background: "#f8fafc",
    color: "#0f172a",
    textDecoration: "none",
    border: "1px solid #e2e8f0",
  },
  emptyText: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.6,
  },
};

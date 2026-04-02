import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import { CLIENTE_CLASSIFICACAO } from "../constants/clientes";
import { listarClientes } from "../services/clientes";
import { listarClientesSemContato } from "../services/followup";

function formatarData(data) {
  if (!data) {
    return "Não definida";
  }

  return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
}

function diferencaEmDias(data) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const referencia = new Date(`${data}T00:00:00`);
  referencia.setHours(0, 0, 0, 0);

  return Math.round((referencia.getTime() - hoje.getTime()) / 86400000);
}

function nivelSemContato(dias) {
  if (dias >= 30) {
    return { texto: "Urgente", cor: "#b91c1c", bg: "#fee2e2" };
  }

  return { texto: "Atenção", cor: "#d97706", bg: "#fef3c7" };
}

export default function DiasSemContato() {
  const [semContato, setSemContato] = useState([]);
  const [quentesSemAcao, setQuentesSemAcao] = useState([]);
  const [visitasVencidas, setVisitasVencidas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const [clientesFollowup, clientes] = await Promise.all([
        listarClientesSemContato(15),
        listarClientes(),
      ]);

      if (!ativo) {
        return;
      }

      const listaClientes = clientes || [];

      setSemContato((clientesFollowup || []).slice(0, 8));
      setQuentesSemAcao(
        listaClientes
          .filter(
            (cliente) =>
              cliente.classificacao === CLIENTE_CLASSIFICACAO.QUENTE &&
              !cliente.proxima_acao
          )
          .slice(0, 8)
      );
      setVisitasVencidas(
        listaClientes
          .filter(
            (cliente) =>
              cliente.proxima_visita && diferencaEmDias(cliente.proxima_visita) < 0
          )
          .sort((a, b) => a.proxima_visita.localeCompare(b.proxima_visita))
          .slice(0, 8)
      );
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <h1 style={styles.title}>Alertas</h1>
        <p style={styles.subtitle}>
          Uma visão de risco da carteira para você identificar clientes parados,
          visitas vencidas e oportunidades quentes sem próximo passo definido.
        </p>
      </section>

      <section style={styles.grid}>
        <Card title="Sem contato 15+ dias" value={semContato.length} />
        <Card title="Quentes sem ação" value={quentesSemAcao.length} />
        <Card title="Visitas vencidas" value={visitasVencidas.length} />
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Clientes sem contato há 15+ dias</h2>
        <p style={styles.sectionText}>
          Clientes que estão esfriando e merecem retomada de relacionamento.
        </p>

        {semContato.length === 0 ? (
          <Card>
            <p>Todos os clientes estão em dia.</p>
          </Card>
        ) : (
          <div style={styles.stack}>
            {semContato.map((cliente) => {
              const status = nivelSemContato(cliente.dias);

              return (
                <Card key={cliente.cliente_id}>
                  <div style={styles.rowTitle}>
                    <b>{cliente.nome}</b>
                    <span
                      style={{
                        ...styles.badge,
                        background: status.bg,
                        color: status.cor,
                      }}
                    >
                      {status.texto}
                    </span>
                  </div>
                  <p style={styles.metaLine}>
                    Empresa: <b>{cliente.empresa || "Não informada"}</b>
                  </p>
                  <p style={styles.metaLine}>{cliente.dias} dias sem contato</p>
                  <button
                    style={styles.button}
                    onClick={() => navigate(`/clientes/${cliente.cliente_id}`)}
                  >
                    Abrir cliente
                  </button>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section style={styles.twoCols}>
        <div>
          <h2 style={styles.sectionTitle}>Clientes quentes sem próxima ação</h2>
          <p style={styles.sectionText}>
            Oportunidades boas que ainda estão sem direcionamento comercial claro.
          </p>

          {quentesSemAcao.length === 0 ? (
            <Card>
              <p>Nenhum cliente quente está sem próxima ação.</p>
            </Card>
          ) : (
            <div style={styles.stack}>
              {quentesSemAcao.map((cliente) => (
                <Card key={cliente.id}>
                  <b>{cliente.nome}</b>
                  <p style={styles.metaLine}>
                    Empresa: <b>{cliente.empresa || "Não informada"}</b>
                  </p>
                  <button
                    style={styles.button}
                    onClick={() => navigate(`/clientes/${cliente.id}`)}
                  >
                    Definir próxima ação
                  </button>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 style={styles.sectionTitle}>Visitas vencidas</h2>
          <p style={styles.sectionText}>
            Clientes com data de visita passada, mas sem atualização recente.
          </p>

          {visitasVencidas.length === 0 ? (
            <Card>
              <p>Nenhuma visita vencida encontrada.</p>
            </Card>
          ) : (
            <div style={styles.stack}>
              {visitasVencidas.map((cliente) => (
                <Card key={cliente.id}>
                  <b>{cliente.nome}</b>
                  <p style={styles.metaLine}>
                    Próxima visita registrada: <b>{formatarData(cliente.proxima_visita)}</b>
                  </p>
                  <button
                    style={styles.button}
                    onClick={() => navigate(`/clientes/${cliente.id}`)}
                  >
                    Atualizar cliente
                  </button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  hero: {
    padding: "24px",
    borderRadius: "20px",
    background:
      "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(239,68,68,0.08))",
    border: "1px solid rgba(245,158,11,0.18)",
  },
  title: {
    margin: "0 0 8px",
  },
  subtitle: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.6,
    maxWidth: 760,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 18,
  },
  section: {},
  sectionTitle: {
    margin: "0 0 8px",
  },
  sectionText: {
    margin: "0 0 16px",
    color: "#64748b",
    lineHeight: 1.6,
  },
  stack: {
    display: "grid",
    gap: 14,
  },
  twoCols: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 24,
  },
  rowTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 10,
  },
  badge: {
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  metaLine: {
    margin: "0 0 10px",
    color: "#475569",
    lineHeight: 1.6,
  },
  button: {
    marginTop: "8px",
    padding: "10px 12px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

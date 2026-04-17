import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import { getClienteClassificacaoLabel } from "../constants/clientes";
import { listarClientes } from "../services/clientes";
import { listarClientesSemContato } from "../services/followup";
import {
  listarTarefasDoDia,
  listarTarefasPendentes,
} from "../services/tarefas";
import { filtrarProximasAcoes } from "../utils/proximasAcoes";

function diferencaEmDias(data) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const referencia = new Date(`${data}T00:00:00`);
  referencia.setHours(0, 0, 0, 0);

  return Math.round((referencia.getTime() - hoje.getTime()) / 86400000);
}

function formatarData(data) {
  return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
}

function rotuloPlanejamento(dias) {
  if (dias === 1) {
    return "Amanhã";
  }

  return `Em ${dias} dias`;
}

export default function Hoje() {
  const [tarefasHoje, setTarefasHoje] = useState([]);
  const [tarefasPendentes, setTarefasPendentes] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [quentes, setQuentes] = useState([]);
  const [acoes, setAcoes] = useState([]);
  const [planejamentoFuturo, setPlanejamentoFuturo] = useState([]);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const [doDia, pendentes, clientesSemContato, clientes] = await Promise.all([
        listarTarefasDoDia(),
        listarTarefasPendentes(),
        listarClientesSemContato(15),
        listarClientes(),
      ]);

      if (!ativo) {
        return;
      }

      const listaClientes = clientes || [];

      setTarefasHoje(doDia || []);
      setTarefasPendentes(pendentes || []);
      setFollowups((clientesSemContato || []).slice(0, 5));
      setQuentes(
        listaClientes
          .filter((cliente) => cliente.classificacao === "QUENTE")
          .slice(0, 5)
      );
      setAcoes(filtrarProximasAcoes(listaClientes, 0));
      setPlanejamentoFuturo(
        listaClientes
          .filter((cliente) => cliente.proxima_acao && cliente.proxima_visita)
          .map((cliente) => ({
            ...cliente,
            diasParaAcao: diferencaEmDias(cliente.proxima_visita),
          }))
          .filter(
            (cliente) =>
              cliente.diasParaAcao >= 1 && cliente.diasParaAcao <= 5
          )
          .sort((a, b) => a.diasParaAcao - b.diasParaAcao)
          .slice(0, 6)
      );
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, []);

  const tarefasUrgentes = tarefasPendentes.filter(
    (tarefa) => diferencaEmDias(tarefa.data) <= 0
  );

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div>
          <div style={styles.eyebrow}>Execução diária</div>
          <h1 style={styles.title}>Hoje</h1>
          <p style={styles.subtitle}>
            Uma visão objetiva do que já venceu, do que precisa acontecer hoje
            e do que está entrando no radar da próxima semana.
          </p>
        </div>
      </section>

      <section style={styles.statsGrid}>
        <Card title="Tarefas de hoje" value={tarefasHoje.length} />
        <Card title="Tarefas urgentes" value={tarefasUrgentes.length} />
        <Card title="Próximas ações" value={acoes.length} />
        <Card title="Follow-up 15+ dias" value={followups.length} />
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Próximas ações</h2>
        <p style={styles.sectionText}>
          Aqui entram apenas ações vencidas ou marcadas para hoje.
        </p>
        {acoes.length === 0 ? (
          <Card>
            <p style={styles.emptyText}>Nenhuma ação vence hoje.</p>
          </Card>
        ) : (
          <div style={styles.stack}>
            {acoes.map((cliente) => (
              <Card key={cliente.id}>
                <div style={styles.rowTitle}>
                  <b>{cliente.nome}</b>
                  <span style={styles.badgeDanger}>
                    {cliente.diasParaAcao < 0 ? "Vencida" : "Hoje"}
                  </span>
                </div>
                <p style={styles.metaLine}>
                  Próxima ação: <b>{cliente.proxima_acao}</b>
                </p>
                <p style={styles.metaLine}>
                  Data: <b>{formatarData(cliente.proxima_visita)}</b>
                </p>
                <Link to={`/clientes/${cliente.id}`} style={styles.linkButton}>
                  Abrir cliente
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Tarefas urgentes</h2>
        <p style={styles.sectionText}>
          Apenas tarefas vencidas ou com vencimento para hoje.
        </p>
        {tarefasUrgentes.length === 0 ? (
          <Card>
            <p style={styles.emptyText}>Nenhuma tarefa urgente no momento.</p>
          </Card>
        ) : (
          <div style={styles.stack}>
            {tarefasUrgentes.map((tarefa) => (
              <Card key={tarefa.id}>
                <div style={styles.rowTitle}>
                  <b>{tarefa.titulo}</b>
                  <span
                    style={
                      diferencaEmDias(tarefa.data) < 0
                        ? styles.badgeDanger
                        : styles.badgeToday
                    }
                  >
                    {diferencaEmDias(tarefa.data) < 0 ? "Vencida" : "Hoje"}
                  </span>
                </div>
                <p style={styles.metaLine}>
                  Cliente: <b>{tarefa.cliente_nome}</b>
                </p>
                <p style={styles.metaLine}>
                  Tipo: <b>{tarefa.tipo}</b>
                </p>
                <p style={styles.metaLine}>
                  Data: <b>{formatarData(tarefa.data)}</b>
                </p>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section style={styles.twoCols}>
        <div>
          <h2 style={styles.sectionTitle}>Clientes quentes</h2>
          <p style={styles.sectionText}>
            Uma amostra de oportunidades que merecem acompanhamento próximo.
          </p>
          {quentes.length === 0 ? (
            <Card>
              <p style={styles.emptyText}>Nenhum cliente quente em destaque.</p>
            </Card>
          ) : (
            <div style={styles.stack}>
              {quentes.map((cliente) => (
                <Card key={cliente.id}>
                  <div style={styles.rowTitle}>
                    <b>{cliente.nome}</b>
                    <span style={styles.badgeWarm}>
                      {getClienteClassificacaoLabel(cliente.classificacao)}
                    </span>
                  </div>
                  <p style={styles.metaLine}>
                    Empresa: <b>{cliente.empresa || "Não informada"}</b>
                  </p>
                  <Link to={`/clientes/${cliente.id}`} style={styles.linkButton}>
                    Ver cliente
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 style={styles.sectionTitle}>Planejamento futuro</h2>
          <p style={styles.sectionText}>
            Mostra apenas ações entre amanhã e os próximos 5 dias.
          </p>
          {planejamentoFuturo.length === 0 ? (
            <Card>
              <p style={styles.emptyText}>Nada próximo entrando no radar.</p>
            </Card>
          ) : (
            <div style={styles.stack}>
              {planejamentoFuturo.map((cliente) => (
                <Card key={cliente.id}>
                  <div style={styles.rowTitle}>
                    <b>{cliente.nome}</b>
                    <span style={styles.badgeFuture}>
                      {rotuloPlanejamento(cliente.diasParaAcao)}
                    </span>
                  </div>
                  <p style={styles.metaLine}>
                    Próxima ação: <b>{cliente.proxima_acao}</b>
                  </p>
                  <p style={styles.metaLine}>
                    Data: <b>{formatarData(cliente.proxima_visita)}</b>
                  </p>
                  <Link to={`/clientes/${cliente.id}`} style={styles.linkButton}>
                    Abrir cliente
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Sem contato há 15+ dias</h2>
        <p style={styles.sectionText}>
          Clientes que correm risco de esfriar se não houver retomada.
        </p>
        {followups.length === 0 ? (
          <Card>
            <p style={styles.emptyText}>Nenhum follow-up crítico na amostra.</p>
          </Card>
        ) : (
          <div style={styles.stack}>
            {followups.map((cliente) => (
              <Card key={cliente.cliente_id}>
                <div style={styles.rowTitle}>
                  <b>{cliente.nome}</b>
                  <span style={styles.badgeDanger}>{cliente.dias} dias</span>
                </div>
                <p style={styles.metaLine}>
                  Empresa: <b>{cliente.empresa || "Não informada"}</b>
                </p>
                <Link
                  to={`/clientes/${cliente.cliente_id}`}
                  style={styles.linkButton}
                >
                  Retomar contato
                </Link>
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
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  hero: {
    padding: "24px",
    borderRadius: 20,
    border: "1px solid rgba(13,148,136,0.16)",
    background:
      "linear-gradient(135deg, rgba(13,148,136,0.12), rgba(59,130,246,0.08))",
  },
  eyebrow: {
    display: "inline-block",
    marginBottom: 10,
    padding: "4px 10px",
    borderRadius: 999,
    background: "rgba(13,148,136,0.12)",
    color: "#0f766e",
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  title: {
    margin: "0 0 8px",
  },
  subtitle: {
    margin: 0,
    color: "#475569",
    lineHeight: 1.6,
    maxWidth: 760,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: 16,
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
  twoCols: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20,
  },
  stack: {
    display: "grid",
    gap: 14,
  },
  rowTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 10,
  },
  metaLine: {
    margin: "0 0 10px",
    color: "#475569",
    lineHeight: 1.6,
  },
  emptyText: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.6,
  },
  badgeDanger: {
    padding: "4px 10px",
    borderRadius: 999,
    background: "#fee2e2",
    color: "#b91c1c",
    fontSize: 12,
    fontWeight: 700,
  },
  badgeToday: {
    padding: "4px 10px",
    borderRadius: 999,
    background: "#ccfbf1",
    color: "#0f766e",
    fontSize: 12,
    fontWeight: 700,
  },
  badgeWarm: {
    padding: "4px 10px",
    borderRadius: 999,
    background: "#fef3c7",
    color: "#b45309",
    fontSize: 12,
    fontWeight: 700,
  },
  badgeFuture: {
    padding: "4px 10px",
    borderRadius: 999,
    background: "#dbeafe",
    color: "#1d4ed8",
    fontSize: 12,
    fontWeight: 700,
  },
  linkButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 12px",
    borderRadius: 10,
    background: "#2563eb",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 700,
  },
};

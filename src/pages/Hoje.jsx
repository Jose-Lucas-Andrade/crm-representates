import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import {
  CLIENTE_CLASSIFICACAO,
  getClienteClassificacaoLabel,
} from "../constants/clientes";
import { listarClientes } from "../services/clientes";
import { listarClientesSemContato } from "../services/followup";
import { listarTarefasDoDia, listarTarefasPendentes } from "../services/tarefas";
import { filtrarProximasAcoes } from "../utils/proximasAcoes";

function formatarData(data) {
  if (!data) {
    return "Sem data definida";
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
      const [tarefasDoDia, tarefasAbertas, clientesSemContato, clientes] =
        await Promise.all([
          listarTarefasDoDia(),
          listarTarefasPendentes(),
          listarClientesSemContato(15),
          listarClientes(),
        ]);

      if (!ativo) {
        return;
      }

      const listaClientes = clientes || [];

      setTarefasHoje(tarefasDoDia || []);
      setTarefasPendentes((tarefasAbertas || []).slice(0, 5));
      setFollowups((clientesSemContato || []).slice(0, 5));
      setQuentes(
        listaClientes
          .filter((cliente) => cliente.classificacao === CLIENTE_CLASSIFICACAO.QUENTE)
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
            (cliente) => cliente.diasParaAcao >= 1 && cliente.diasParaAcao <= 5
          )
          .sort((a, b) => a.diasParaAcao - b.diasParaAcao)
          .slice(0, 5)
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
    <div>
      <section style={styles.hero}>
        <div>
          <h1 style={styles.heroTitle}>Hoje</h1>
          <p style={styles.heroText}>
            Sua rotina comercial em uma só tela: prioridades imediatas, tarefas em
            aberto, clientes quentes e follow-ups que não podem esfriar.
          </p>
        </div>
      </section>

      <section style={styles.grid}>
        <Card title="Tarefas de hoje" value={tarefasHoje.length} />
        <Card title="Pendências urgentes" value={tarefasUrgentes.length} />
        <Card title="Follow-ups urgentes" value={followups.length} />
        <Card title="Próximas ações" value={acoes.length} />
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Próximas ações</h2>
            <p style={styles.sectionText}>
              Este bloco mostra apenas ações vencidas ou marcadas para hoje.
            </p>
          </div>
        </div>

        {acoes.length === 0 ? (
          <Card>
            <p>Nenhuma próxima ação urgente cadastrada.</p>
          </Card>
        ) : (
          <div style={styles.stack}>
            {acoes.map((cliente) => (
              <Card key={cliente.id}>
                <div style={styles.rowTitle}>
                  <b>{cliente.nome}</b>
                  <span style={styles.badgeMuted}>
                    {getClienteClassificacaoLabel(cliente.classificacao)}
                  </span>
                </div>
                <p style={styles.metaLine}>
                  Próxima ação: <b>{cliente.proxima_acao || "Sem descrição"}</b>
                </p>
                <p style={styles.metaLine}>
                  Próxima visita: <b>{formatarData(cliente.proxima_visita)}</b>
                </p>
                <Link to={`/clientes/${cliente.id}`}>Abrir cliente</Link>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section style={styles.twoCols}>
        <div>
          <h2 style={styles.sectionTitle}>Tarefas urgentes</h2>
          <p style={styles.sectionText}>
            Aqui entram apenas tarefas vencidas ou marcadas para hoje.
          </p>

          {tarefasUrgentes.length === 0 ? (
            <Card>
              <p>Nenhuma tarefa urgente no momento.</p>
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
                          ? styles.badgeOverdue
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
                    Data: <b>{formatarData(tarefa.data)}</b>
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 style={styles.sectionTitle}>Clientes quentes</h2>
          <p style={styles.sectionText}>
            Negociações que pedem retorno rápido para não perder o timing.
          </p>

          {quentes.length === 0 ? (
            <Card>
              <p>Nenhum cliente marcado como quente.</p>
            </Card>
          ) : (
            <div style={styles.stack}>
              {quentes.map((cliente) => (
                <Card key={cliente.id}>
                  <div style={styles.rowTitle}>
                    <b>{cliente.nome}</b>
                    <span style={styles.badgeHot}>Quente</span>
                  </div>
                  <p style={styles.metaLine}>
                    Empresa: <b>{cliente.empresa || "Não informada"}</b>
                  </p>
                  <p style={styles.metaLine}>
                    Próxima ação: <b>{cliente.proxima_acao || "Sem descrição"}</b>
                  </p>
                  <Link to={`/clientes/${cliente.id}`}>Abrir cliente</Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section style={styles.twoCols}>
        <div>
          <h2 style={styles.sectionTitle}>Planejamento futuro</h2>
          <p style={styles.sectionText}>
            Ações já definidas para os próximos 5 dias, sem poluir a urgência do dia.
          </p>

          {planejamentoFuturo.length === 0 ? (
            <Card>
              <p>Nenhuma ação próxima cadastrada fora da urgência de hoje.</p>
            </Card>
          ) : (
            <div style={styles.stack}>
              {planejamentoFuturo.map((cliente) => (
                <Card key={cliente.id}>
                  <div style={styles.rowTitle}>
                    <b>{cliente.nome}</b>
                    <span style={styles.badgeFuture}>
                      {cliente.diasParaAcao === 1
                        ? "Amanhã"
                        : `Em ${cliente.diasParaAcao} dias`}
                    </span>
                  </div>
                  <p style={styles.metaLine}>
                    Próxima ação: <b>{cliente.proxima_acao}</b>
                  </p>
                  <p style={styles.metaLine}>
                    Próxima visita: <b>{formatarData(cliente.proxima_visita)}</b>
                  </p>
                  <Link to={`/clientes/${cliente.id}`}>Abrir cliente</Link>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 style={styles.sectionTitle}>Sem contato há 15+ dias</h2>
          <p style={styles.sectionText}>
            Clientes que merecem um retorno para manter relacionamento e pós-venda.
          </p>

          {followups.length === 0 ? (
            <Card>
              <p>Todos os clientes estão em dia.</p>
            </Card>
          ) : (
            <div style={styles.stack}>
              {followups.map((cliente) => (
                <Card key={cliente.cliente_id}>
                  <b>{cliente.nome}</b>
                  <p style={styles.metaLine}>
                    Empresa: <b>{cliente.empresa || "Não informada"}</b>
                  </p>
                  <p style={styles.metaLine}>{cliente.dias} dias sem contato</p>
                  <Link to={`/clientes/${cliente.cliente_id}`}>Registrar contato</Link>
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
  hero: {
    marginBottom: 24,
    padding: "24px",
    borderRadius: "20px",
    background:
      "linear-gradient(135deg, rgba(14,165,233,0.12), rgba(37,99,235,0.08))",
    border: "1px solid rgba(59,130,246,0.16)",
  },
  heroTitle: {
    margin: "0 0 8px",
  },
  heroText: {
    margin: 0,
    color: "#475569",
    maxWidth: 760,
    lineHeight: 1.6,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 18,
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    marginBottom: 16,
  },
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
    gap: 24,
    marginBottom: 30,
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
    marginBottom: 10,
    flexWrap: "wrap",
  },
  badgeMuted: {
    padding: "4px 10px",
    borderRadius: "999px",
    background: "#e2e8f0",
    color: "#334155",
    fontSize: "12px",
    fontWeight: "bold",
  },
  badgeHot: {
    padding: "4px 10px",
    borderRadius: "999px",
    background: "#fee2e2",
    color: "#b91c1c",
    fontSize: "12px",
    fontWeight: "bold",
  },
  badgeToday: {
    padding: "4px 10px",
    borderRadius: "999px",
    background: "#ccfbf1",
    color: "#0f766e",
    fontSize: "12px",
    fontWeight: "bold",
  },
  badgeOverdue: {
    padding: "4px 10px",
    borderRadius: "999px",
    background: "#fee2e2",
    color: "#b91c1c",
    fontSize: "12px",
    fontWeight: "bold",
  },
  badgeFuture: {
    padding: "4px 10px",
    borderRadius: "999px",
    background: "#dbeafe",
    color: "#1d4ed8",
    fontSize: "12px",
    fontWeight: "bold",
  },
  metaLine: {
    margin: "0 0 8px",
    color: "#475569",
    lineHeight: 1.6,
  },
};

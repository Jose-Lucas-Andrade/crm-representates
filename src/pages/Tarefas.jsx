import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { concluirTarefa, listarTarefasPendentes } from "../services/tarefas";

function formatarData(data) {
  if (!data) {
    return "Sem data";
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

export default function Tarefas() {
  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const data = await listarTarefasPendentes();
      if (ativo) {
        setTarefas(data || []);
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, []);

  async function concluir(id) {
    await concluirTarefa(id);
    const data = await listarTarefasPendentes();
    setTarefas(data || []);
  }

  const tarefasHoje = tarefas.filter((tarefa) => diferencaEmDias(tarefa.data) === 0);
  const tarefasVencidas = tarefas.filter((tarefa) => diferencaEmDias(tarefa.data) < 0);
  const tarefasFuturas = tarefas.filter((tarefa) => diferencaEmDias(tarefa.data) > 0);

  return (
    <div>
      <section style={styles.hero}>
        <h1 style={styles.title}>Tarefas</h1>
        <p style={styles.subtitle}>
          Acompanhe tudo o que está pendente, sem limitar a visão apenas ao dia de hoje.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Vencidas</h2>
        <ListaTarefas tarefas={tarefasVencidas} onConcluir={concluir} destaque="Vencida" cor="#b91c1c" fundo="#fee2e2" />
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Hoje</h2>
        <ListaTarefas tarefas={tarefasHoje} onConcluir={concluir} destaque="Hoje" cor="#0f766e" fundo="#ccfbf1" />
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Próximas</h2>
        <ListaTarefas tarefas={tarefasFuturas} onConcluir={concluir} destaque="Agendada" cor="#1d4ed8" fundo="#dbeafe" />
      </section>
    </div>
  );
}

function ListaTarefas({ tarefas, onConcluir, destaque, cor, fundo }) {
  if (tarefas.length === 0) {
    return (
      <Card>
        <p>Nenhuma tarefa nesta seção.</p>
      </Card>
    );
  }

  return (
    <div style={styles.list}>
      {tarefas.map((tarefa) => (
        <Card key={tarefa.id}>
          <div style={styles.cardHeader}>
            <div>
              <b>{tarefa.titulo}</b>
              <p style={styles.typeLine}>{tarefa.tipo}</p>
            </div>
            <span style={{ ...styles.badge, color: cor, background: fundo }}>
              {destaque}
            </span>
          </div>

          <div style={styles.clientLine}>
            Cliente: <b>{tarefa.cliente_nome}</b>
          </div>

          <div style={styles.clientLine}>
            Data: <b>{formatarData(tarefa.data)}</b>
          </div>

          <Button onClick={() => onConcluir(tarefa.id)}>Concluir</Button>
        </Card>
      ))}
    </div>
  );
}

const styles = {
  hero: {
    marginBottom: 24,
    padding: "22px 24px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, rgba(15,118,110,0.12), rgba(59,130,246,0.08))",
    border: "1px solid rgba(13,148,136,0.18)",
  },
  title: {
    margin: "0 0 6px",
  },
  subtitle: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.6,
    maxWidth: 680,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    marginBottom: 14,
  },
  list: {
    display: "grid",
    gap: 14,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 14,
  },
  typeLine: {
    margin: "6px 0 0",
    color: "#64748b",
  },
  badge: {
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  clientLine: {
    marginBottom: 12,
    color: "#475569",
    lineHeight: 1.6,
  },
};

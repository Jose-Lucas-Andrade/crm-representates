import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { obterResumo } from "../services/dashboard";
import { listarClientesSemContato } from "../services/followup";
import { listarTarefasDoDia } from "../services/tarefas";

import Card from "../components/ui/Card";

export default function Dashboard() {
  const [resumo, setResumo] = useState(null);
  const [followups, setFollowups] = useState([]);
  const [tarefasHoje, setTarefasHoje] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const r = await obterResumo();
    setResumo(r);

    const listaFollowup = await listarClientesSemContato(7);
    setFollowups(listaFollowup);

    const tarefas = await listarTarefasDoDia();
    setTarefasHoje(tarefas);
  }

  if (!resumo) return <p>Carregando Dashboard...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      {/* ===== Cards principais ===== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 20,
          marginBottom: 30,
        }}
      >
        <Card title="Prospects" value={resumo.prospects} />
        <Card title="Negociação" value={resumo.negociacao} />
        <Card title="Clientes" value={resumo.clientes} />
        <Card title="Inativos" value={resumo.inativos} />
        <Card title="Contatos hoje" value={resumo.contatos_hoje} />
      </div>

      {/* ===== Tarefas do dia ===== */}
      <div style={{ marginTop: 30 }}>
        <h2>📅 Tarefas de Hoje</h2>

        {tarefasHoje.length === 0 ? (
          <p>Nenhuma tarefa para hoje 🎉</p>
        ) : (
          tarefasHoje.map((t) => (
            <Card key={t.id}>
              <b>{t.titulo}</b> ({t.tipo})
              <br />
              Cliente: <b>{t.cliente_nome}</b>
            </Card>
          ))
        )}
      </div>

      {/* ===== Follow-up ===== */}
      <div style={{ marginTop: 30 }}>
        <h2>⚠️ Clientes sem contato há 7+ dias</h2>

        {followups.length === 0 ? (
          <p>Tudo em dia! 👌</p>
        ) : (
          followups.map((c) => (
            <Card key={c.cliente_id}>
              <b>{c.nome}</b> — {c.empresa}
              <br />
              {c.dias} dias sem contato
              <br />
              <Link to={`/clientes/${c.cliente_id}`}>
                Abrir cliente
              </Link>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
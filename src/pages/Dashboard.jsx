import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  obterResumo,
  contatosHoje,
  tarefasPendentes,
  tarefasVencidas,
} from "../services/dashboard";

import { listarClientesSemContato } from "../services/followup";
import { listarTarefasDoDia } from "../services/tarefas";

import Card from "../components/ui/Card";

export default function Dashboard() {
  const [resumo, setResumo] = useState(null);
  const [contatos, setContatos] = useState(0);
  const [pendentes, setPendentes] = useState(0);
  const [vencidas, setVencidas] = useState(0);

  const [followups, setFollowups] = useState([]);
  const [tarefasHoje, setTarefasHoje] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const r = await obterResumo();
    setResumo(r);

    const contatosHojeTotal = await contatosHoje();
    setContatos(contatosHojeTotal);

    const tarefasPendentesTotal = await tarefasPendentes();
    setPendentes(tarefasPendentesTotal);

    const tarefasVencidasTotal = await tarefasVencidas();
    setVencidas(tarefasVencidasTotal);

    const listaFollowup = await listarClientesSemContato(7);
    setFollowups(listaFollowup);

    const tarefas = await listarTarefasDoDia();
    setTarefasHoje(tarefas);
  }

  return (
    <>
      {!resumo ? (
        <p>Carregando Dashboard...</p>
      ) : (
        <>
          <h1 style={{ marginBottom: "25px" }}>Dashboard</h1>

          {/* ===== Cards principais ===== */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 20,
              marginBottom: 40,
            }}
          >
            <Card title="Prospects" value={resumo.prospects} />
            <Card title="Negociação" value={resumo.negociacao} />
            <Card title="Clientes" value={resumo.clientes} />
            <Card title="Inativos" value={resumo.inativos} />

            <Card title="Contatos hoje" value={contatos} />
            <Card title="Tarefas pendentes" value={pendentes} />
            <Card title="Tarefas vencidas" value={vencidas} />
          </div>

          {/* ===== Tarefas do dia ===== */}

          <div style={{ marginBottom: 40 }}>
            <h2 style={{ marginBottom: 15 }}>📅 Tarefas de Hoje</h2>

            {tarefasHoje.length === 0 ? (
              <Card>
                <p>Nenhuma tarefa para hoje 🎉</p>
              </Card>
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

          <div>
            <h2 style={{ marginBottom: 30 }}>
              ⚠ Clientes sem contato há 30+ dias
            </h2>

            {followups.length === 0 ? (
              <Card>
                <p>Tudo em dia! 👌</p>
              </Card>
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
        </>
      )}
    </>
  );
}
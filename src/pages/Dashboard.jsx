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
    let ativo = true;

    async function carregarDados() {
      const resumoData = await obterResumo();
      const contatosHojeTotal = await contatosHoje();
      const tarefasPendentesTotal = await tarefasPendentes();
      const tarefasVencidasTotal = await tarefasVencidas();
      const listaFollowup = await listarClientesSemContato(15);
      const tarefas = await listarTarefasDoDia();

      if (!ativo) {
        return;
      }

      setResumo(resumoData);
      setContatos(contatosHojeTotal);
      setPendentes(tarefasPendentesTotal);
      setVencidas(tarefasVencidasTotal);
      setFollowups(listaFollowup);
      setTarefasHoje(tarefas);
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <>
      {!resumo ? (
        <p>Carregando dashboard...</p>
      ) : (
        <>
          <div style={styles.hero}>
            <div>
              <h1 style={{ marginBottom: 6 }}>Dashboard</h1>
              <p style={styles.heroText}>
                Veja rapidamente oportunidades ativas, follow-ups pendentes e a carga de trabalho do dia.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 20,
              marginBottom: 40,
            }}
          >
            <Card title="Prospects" value={resumo.prospects} />
            <Card title="Negociacao" value={resumo.negociacao} />
            <Card title="Clientes" value={resumo.clientes} />
            <Card title="Inativos" value={resumo.inativos} />
            <Card title="Contatos hoje" value={contatos} />
            <Card title="Tarefas pendentes" value={pendentes} />
            <Card title="Tarefas vencidas" value={vencidas} />
          </div>

          <div style={{ marginBottom: 40 }}>
            <h2 style={{ marginBottom: 15 }}>Tarefas de hoje</h2>

            {tarefasHoje.length === 0 ? (
              <Card>
                <p>Nenhuma tarefa para hoje.</p>
              </Card>
            ) : (
              tarefasHoje.map((tarefa) => (
                <Card key={tarefa.id}>
                  <b>{tarefa.titulo}</b> ({tarefa.tipo})
                  <br />
                  Cliente: <b>{tarefa.cliente_nome}</b>
                </Card>
              ))
            )}
          </div>

          <div>
            <h2 style={{ marginBottom: 30 }}>Clientes sem contato ha 15+ dias</h2>

            {followups.length === 0 ? (
              <Card>
                <p>Tudo em dia.</p>
              </Card>
            ) : (
              followups.map((cliente) => (
                <Card key={cliente.cliente_id}>
                  <b>{cliente.nome}</b> - {cliente.empresa}
                  <br />
                  {cliente.dias} dias sem contato
                  <br />
                  <Link to={`/clientes/${cliente.cliente_id}`}>Abrir cliente</Link>
                </Card>
              ))
            )}
          </div>
        </>
      )}
    </>
  );
}

const styles = {
  hero: {
    marginBottom: 25,
    padding: "22px 24px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, rgba(37,99,235,0.10), rgba(14,165,233,0.08))",
    border: "1px solid rgba(59,130,246,0.16)",
  },
  heroText: {
    margin: 0,
    color: "#475569",
    maxWidth: 700,
    lineHeight: 1.5,
  },
};

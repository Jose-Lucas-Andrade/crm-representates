import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import {
  CLIENTE_CLASSIFICACAO,
  CLIENTE_CLASSIFICACAO_OPTIONS,
  CLIENTE_STATUS,
  CLIENTE_STATUS_OPTIONS,
  getClienteClassificacaoLabel,
  getClienteStatusLabel,
} from "../constants/clientes";
import { criarContato, listarContatos } from "../services/contatos";
import { atualizarCliente } from "../services/clientes";
import {
  concluirTarefa,
  criarTarefa,
  listarTarefasDoCliente,
} from "../services/tarefas";
import { supabase } from "../supabaseClient";

function formatarData(data) {
  if (!data) {
    return "Não definida";
  }

  return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
}

const fieldInputStyle = {
  padding: "11px 12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  width: "100%",
  background: "#fff",
};

export default function ClienteDetalhe() {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);
  const [tarefas, setTarefas] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [dataContato, setDataContato] = useState("");
  const [obs, setObs] = useState("");
  const [tituloTarefa, setTituloTarefa] = useState("");
  const [tipoTarefa, setTipoTarefa] = useState("Ligação");
  const [dataTarefa, setDataTarefa] = useState("");
  const [resumoRapido, setResumoRapido] = useState({
    status: CLIENTE_STATUS.PROSPECT,
    classificacao: CLIENTE_CLASSIFICACAO.MORNO,
    proxima_acao: "",
    proxima_visita: "",
  });

  async function carregarCliente() {
    const { data } = await supabase.from("clientes").select("*").eq("id", id).single();
    setCliente(data);

    if (data) {
      setResumoRapido({
        status: data.status || CLIENTE_STATUS.PROSPECT,
        classificacao: data.classificacao || CLIENTE_CLASSIFICACAO.MORNO,
        proxima_acao: data.proxima_acao || "",
        proxima_visita: data.proxima_visita || "",
      });
    }
  }

  function gerarTimeline(contatosData, tarefasData) {
    const contatosTimeline = contatosData.map((contato) => ({
      tipo: "contato",
      data: contato.data_contato,
      texto: `Contato: ${contato.observacao || "Sem observação"}`,
    }));

    const tarefasTimeline = tarefasData.map((tarefa) => ({
      tipo: "tarefa",
      data: tarefa.data,
      texto: `Tarefa: ${tarefa.titulo} (${tarefa.tipo})`,
    }));

    const combinado = [...contatosTimeline, ...tarefasTimeline];
    combinado.sort((a, b) => new Date(b.data) - new Date(a.data));
    setTimeline(combinado);
  }

  useEffect(() => {
    let ativo = true;

    async function carregarTudo() {
      const { data } = await supabase.from("clientes").select("*").eq("id", id).single();
      const contatosData = await listarContatos(id);
      const tarefasData = await listarTarefasDoCliente(id);

      if (!ativo) {
        return;
      }

      setCliente(data);
      setTarefas(tarefasData || []);
      gerarTimeline(contatosData || [], tarefasData || []);

      if (data) {
        setResumoRapido({
          status: data.status || CLIENTE_STATUS.PROSPECT,
          classificacao: data.classificacao || CLIENTE_CLASSIFICACAO.MORNO,
          proxima_acao: data.proxima_acao || "",
          proxima_visita: data.proxima_visita || "",
        });
      }
    }

    carregarTudo();

    return () => {
      ativo = false;
    };
  }, [id]);

  async function salvarResumoRapido(e) {
    e.preventDefault();

    const ok = await atualizarCliente(id, {
      ...cliente,
      ...resumoRapido,
      proxima_visita: resumoRapido.proxima_visita || null,
    });

    if (!ok) {
      return;
    }

    await carregarCliente();
  }

  async function registrarContato(e) {
    e.preventDefault();

    await criarContato({
      cliente_id: id,
      data_contato: dataContato,
      observacao: obs,
    });

    setDataContato("");
    setObs("");
    await carregarCliente();

    const contatosData = await listarContatos(id);
    const tarefasData = await listarTarefasDoCliente(id);

    setTarefas(tarefasData || []);
    gerarTimeline(contatosData || [], tarefasData || []);
  }

  async function registrarTarefa(e) {
    e.preventDefault();

    const resultado = await criarTarefa({
      cliente_id: id,
      titulo: tituloTarefa,
      tipo: tipoTarefa,
      data: dataTarefa,
    });

    if (!resultado.ok) {
      alert(`Não foi possível criar a tarefa: ${resultado.error}`);
      return;
    }

    setTituloTarefa("");
    setTipoTarefa("Ligação");
    setDataTarefa("");
    await carregarCliente();

    const contatosData = await listarContatos(id);
    const tarefasData = await listarTarefasDoCliente(id);

    setTarefas(tarefasData || []);
    gerarTimeline(contatosData || [], tarefasData || []);
  }

  async function concluir(idTarefa) {
    await concluirTarefa(idTarefa);
    await carregarCliente();

    const contatosData = await listarContatos(id);
    const tarefasData = await listarTarefasDoCliente(id);

    setTarefas(tarefasData || []);
    gerarTimeline(contatosData || [], tarefasData || []);
  }

  if (!cliente) {
    return <p>Carregando cliente...</p>;
  }

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div>
          <h1 style={styles.heroTitle}>{cliente.nome}</h1>
          <p style={styles.heroText}>
            Atualize a situação comercial sem sair da conversa e mantenha o
            relacionamento sob controle.
          </p>
        </div>
      </section>

      <section style={styles.summaryGrid}>
        <Card>
          <p style={styles.summaryItem}>
            <b>Empresa:</b> {cliente.empresa || "Não informada"}
          </p>
          <p style={styles.summaryItem}>
            <b>Status atual:</b> {getClienteStatusLabel(cliente.status)}
          </p>
        </Card>

        <Card>
          <p style={styles.summaryItem}>
            <b>Classificação atual:</b>{" "}
            {getClienteClassificacaoLabel(cliente.classificacao)}
          </p>
          <p style={styles.summaryItem}>
            <b>Último contato:</b> {formatarData(cliente.ultimo_contato)}
          </p>
        </Card>

        <Card>
          <p style={styles.summaryItem}>
            <b>Próxima ação atual:</b> {cliente.proxima_acao || "Não definida"}
          </p>
          <p style={styles.summaryItem}>
            <b>Próxima visita atual:</b> {formatarData(cliente.proxima_visita)}
          </p>
        </Card>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Atualização rápida do cliente</h2>
          <p style={styles.sectionText}>
            Ajuste status, classificação e próximo passo sem precisar abrir a tela
            de edição completa.
          </p>
        </div>

        <Card>
          <form onSubmit={salvarResumoRapido} style={styles.quickForm}>
            <div style={styles.formField}>
              <label>Status</label>
              <select
                value={resumoRapido.status}
                onChange={(e) =>
                  setResumoRapido({ ...resumoRapido, status: e.target.value })
                }
                style={fieldInputStyle}
              >
                {CLIENTE_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formField}>
              <label>Classificação</label>
              <select
                value={resumoRapido.classificacao}
                onChange={(e) =>
                  setResumoRapido({
                    ...resumoRapido,
                    classificacao: e.target.value,
                  })
                }
                style={fieldInputStyle}
              >
                {CLIENTE_CLASSIFICACAO_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formFieldFull}>
              <label>Próxima ação</label>
              <input
                value={resumoRapido.proxima_acao}
                onChange={(e) =>
                  setResumoRapido({
                    ...resumoRapido,
                    proxima_acao: e.target.value,
                  })
                }
                placeholder="Ex.: confirmar pedido, visitar ou enviar proposta"
                style={fieldInputStyle}
              />
            </div>

            <div style={styles.formField}>
              <label>Próxima visita</label>
              <input
                type="date"
                value={resumoRapido.proxima_visita}
                onChange={(e) =>
                  setResumoRapido({
                    ...resumoRapido,
                    proxima_visita: e.target.value,
                  })
                }
                style={fieldInputStyle}
              />
            </div>

            <div style={styles.formFieldAction}>
              <Button type="submit">Salvar atualização rápida</Button>
            </div>
          </form>
        </Card>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Histórico do cliente</h2>

        {timeline.length === 0 ? (
          <Card>
            <p>Nenhuma atividade registrada.</p>
          </Card>
        ) : (
          <div style={styles.stack}>
            {timeline.map((item, index) => (
              <Card key={`${item.tipo}-${item.data}-${index}`}>
                <b>{formatarData(item.data)}</b>
                <p style={styles.timelineText}>{item.texto}</p>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section style={styles.sectionGrid}>
        <div>
          <h2 style={styles.sectionTitle}>Registrar contato</h2>
          <Card>
            <form onSubmit={registrarContato} style={styles.formStack}>
              <input
                type="date"
                value={dataContato}
                onChange={(e) => setDataContato(e.target.value)}
                required
                style={fieldInputStyle}
              />

              <input
                placeholder="Observação"
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                style={fieldInputStyle}
              />

              <div>
                <Button type="submit">Salvar contato</Button>
              </div>
            </form>
          </Card>
        </div>

        <div>
          <h2 style={styles.sectionTitle}>Criar nova tarefa</h2>
          <Card>
            <form onSubmit={registrarTarefa} style={styles.formStack}>
              <input
                placeholder="Título da tarefa"
                value={tituloTarefa}
                onChange={(e) => setTituloTarefa(e.target.value)}
                required
                style={fieldInputStyle}
              />

              <select
                value={tipoTarefa}
                onChange={(e) => setTipoTarefa(e.target.value)}
                style={fieldInputStyle}
              >
                <option>Ligação</option>
                <option>Visita</option>
                <option>Proposta</option>
                <option>Outro</option>
              </select>

              <input
                type="date"
                value={dataTarefa}
                onChange={(e) => setDataTarefa(e.target.value)}
                required
                style={fieldInputStyle}
              />

              <div>
                <Button type="submit">Criar tarefa</Button>
              </div>
            </form>
          </Card>
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Tarefas pendentes</h2>

        {tarefas.length === 0 ? (
          <Card>
            <p>Nenhuma tarefa pendente.</p>
          </Card>
        ) : (
          <div style={styles.stack}>
            {tarefas.map((tarefa) => (
              <Card key={tarefa.id}>
                <div style={styles.taskHeader}>
                  <div>
                    <b>{tarefa.titulo}</b>
                    <p style={styles.timelineText}>{tarefa.tipo}</p>
                  </div>
                  <span style={styles.taskDate}>{formatarData(tarefa.data)}</span>
                </div>

                <Button onClick={() => concluir(tarefa.id)}>Concluir</Button>
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
    marginBottom: 24,
    padding: "26px",
    borderRadius: "20px",
    background:
      "linear-gradient(135deg, rgba(251,191,36,0.14), rgba(59,130,246,0.08))",
    border: "1px solid rgba(245,158,11,0.2)",
  },
  heroTitle: {
    margin: "0 0 8px",
  },
  heroText: {
    margin: 0,
    color: "#475569",
    lineHeight: 1.6,
    maxWidth: 720,
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginBottom: 30,
  },
  summaryItem: {
    margin: "0 0 10px",
    color: "#334155",
    lineHeight: 1.6,
  },
  section: {
    marginBottom: 32,
  },
  sectionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 24,
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
  timelineText: {
    margin: "8px 0 0",
    color: "#475569",
    lineHeight: 1.6,
  },
  quickForm: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    alignItems: "end",
  },
  formField: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  formFieldFull: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    gridColumn: "1 / -1",
  },
  formFieldAction: {
    display: "flex",
    alignItems: "flex-end",
  },
  formStack: {
    display: "grid",
    gap: 14,
  },
  taskHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  taskDate: {
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#e2e8f0",
    color: "#334155",
    fontSize: "12px",
    fontWeight: "bold",
  },
};

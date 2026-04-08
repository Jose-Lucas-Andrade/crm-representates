import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import {
  CLIENTE_CLASSIFICACAO_OPTIONS,
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

function formatarDataHora(data) {
  if (!data) {
    return "Sem registro";
  }

  return new Date(data).toLocaleString("pt-BR");
}

function montarTimeline(contatos, tarefas) {
  const timelineContatos = (contatos || []).map((contato) => ({
    id: `contato-${contato.id}`,
    tipo: "Contato",
    titulo: contato.observacao || "Contato registrado",
    referencia: contato.data_contato,
    criadoEm: contato.created_at,
  }));

  const timelineTarefas = (tarefas || []).map((tarefa) => ({
    id: `tarefa-${tarefa.id}`,
    tipo: "Tarefa",
    titulo: `${tarefa.titulo} (${tarefa.tipo})`,
    referencia: tarefa.data,
    criadoEm: tarefa.created_at,
  }));

  return [...timelineContatos, ...timelineTarefas].sort(
    (a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)
  );
}

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
    status: "",
    classificacao: "",
    proxima_acao: "",
    proxima_visita: "",
  });

  async function carregarCliente() {
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Erro ao carregar cliente:", error.message);
      return null;
    }

    setCliente(data);
    setResumoRapido({
      status: data?.status || "",
      classificacao: data?.classificacao || "",
      proxima_acao: data?.proxima_acao || "",
      proxima_visita: data?.proxima_visita || "",
    });

    return data;
  }

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const [{ data: clienteData, error }, contatos, tarefasData] =
        await Promise.all([
          supabase.from("clientes").select("*").eq("id", id).maybeSingle(),
          listarContatos(id),
          listarTarefasDoCliente(id),
        ]);

      if (error) {
        console.error("Erro ao carregar cliente:", error.message);
        return;
      }

      if (!ativo) {
        return;
      }

      setCliente(clienteData);
      setResumoRapido({
        status: clienteData?.status || "",
        classificacao: clienteData?.classificacao || "",
        proxima_acao: clienteData?.proxima_acao || "",
        proxima_visita: clienteData?.proxima_visita || "",
      });
      setTarefas(tarefasData || []);
      setTimeline(montarTimeline(contatos || [], tarefasData || []));
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, [id]);

  async function salvarResumoRapido(event) {
    event.preventDefault();

    const ok = await atualizarCliente(id, {
      status: resumoRapido.status,
      classificacao: resumoRapido.classificacao,
      proxima_acao: resumoRapido.proxima_acao || null,
      proxima_visita: resumoRapido.proxima_visita || null,
    });

    if (!ok) {
      return;
    }

    await carregarCliente();
  }

  async function registrarContato(event) {
    event.preventDefault();

    const ok = await criarContato({
      cliente_id: id,
      data_contato: dataContato,
      observacao: obs,
    });

    if (!ok) {
      return;
    }

    setDataContato("");
    setObs("");
    const [contatos, tarefasData] = await Promise.all([
      listarContatos(id),
      listarTarefasDoCliente(id),
    ]);

    setTarefas(tarefasData || []);
    setTimeline(montarTimeline(contatos || [], tarefasData || []));
  }

  async function registrarTarefa(event) {
    event.preventDefault();

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
    const [contatos, tarefasData] = await Promise.all([
      listarContatos(id),
      listarTarefasDoCliente(id),
    ]);

    setTarefas(tarefasData || []);
    setTimeline(montarTimeline(contatos || [], tarefasData || []));
  }

  async function concluir(idTarefa) {
    const ok = await concluirTarefa(idTarefa);
    if (!ok) {
      return;
    }

    const [contatos, tarefasData] = await Promise.all([
      listarContatos(id),
      listarTarefasDoCliente(id),
    ]);

    setTarefas(tarefasData || []);
    setTimeline(montarTimeline(contatos || [], tarefasData || []));
  }

  if (!cliente) {
    return <div>Carregando cliente...</div>;
  }

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div>
          <Link to="/clientes" style={styles.backLink}>
            Voltar para clientes
          </Link>
          <h1 style={styles.title}>{cliente.nome}</h1>
          <p style={styles.subtitle}>
            Centralize o histórico, ajuste o status da negociação e mantenha o
            próximo passo sempre atualizado.
          </p>
        </div>
      </section>

      <section style={styles.summaryGrid}>
        <Card title="Status" value={getClienteStatusLabel(cliente.status)} />
        <Card
          title="Classificação"
          value={getClienteClassificacaoLabel(cliente.classificacao)}
        />
        <Card title="Próxima ação" value={cliente.proxima_acao || "Não definida"} />
        <Card
          title="Próxima visita"
          value={
            cliente.proxima_visita
              ? formatarData(cliente.proxima_visita)
              : "Não definida"
          }
        />
      </section>

      <section>
        <Card>
          <h2 style={styles.sectionTitle}>Atualização rápida</h2>
          <p style={styles.sectionText}>
            Ajuste os pontos mais importantes da negociação sem sair da ficha do
            cliente.
          </p>

          <form onSubmit={salvarResumoRapido} style={styles.formGrid}>
            <label style={styles.field}>
              <span>Status</span>
              <select
                value={resumoRapido.status}
                onChange={(event) =>
                  setResumoRapido((atual) => ({
                    ...atual,
                    status: event.target.value,
                  }))
                }
                style={styles.input}
              >
                {CLIENTE_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label style={styles.field}>
              <span>Classificação</span>
              <select
                value={resumoRapido.classificacao}
                onChange={(event) =>
                  setResumoRapido((atual) => ({
                    ...atual,
                    classificacao: event.target.value,
                  }))
                }
                style={styles.input}
              >
                {CLIENTE_CLASSIFICACAO_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label style={styles.field}>
              <span>Próxima ação</span>
              <input
                type="text"
                value={resumoRapido.proxima_acao}
                onChange={(event) =>
                  setResumoRapido((atual) => ({
                    ...atual,
                    proxima_acao: event.target.value,
                  }))
                }
                style={styles.input}
                placeholder="Ex.: ligar para confirmar proposta"
              />
            </label>

            <label style={styles.field}>
              <span>Próxima visita</span>
              <input
                type="date"
                value={resumoRapido.proxima_visita}
                onChange={(event) =>
                  setResumoRapido((atual) => ({
                    ...atual,
                    proxima_visita: event.target.value,
                  }))
                }
                style={styles.input}
              />
            </label>

            <div style={styles.formActions}>
              <Button type="submit">Salvar atualização</Button>
            </div>
          </form>
        </Card>
      </section>

      <section style={styles.twoCols}>
        <Card>
          <h2 style={styles.sectionTitle}>Registrar contato</h2>
          <form onSubmit={registrarContato} style={styles.formStack}>
            <label style={styles.field}>
              <span>Data do contato</span>
              <input
                type="date"
                value={dataContato}
                onChange={(event) => setDataContato(event.target.value)}
                style={styles.input}
                required
              />
            </label>

            <label style={styles.field}>
              <span>Observação</span>
              <textarea
                value={obs}
                onChange={(event) => setObs(event.target.value)}
                style={styles.textarea}
                placeholder="Registre o que foi conversado"
              />
            </label>

            <Button type="submit">Salvar contato</Button>
          </form>
        </Card>

        <Card>
          <h2 style={styles.sectionTitle}>Criar tarefa</h2>
          <form onSubmit={registrarTarefa} style={styles.formStack}>
            <label style={styles.field}>
              <span>Título</span>
              <input
                type="text"
                value={tituloTarefa}
                onChange={(event) => setTituloTarefa(event.target.value)}
                style={styles.input}
                placeholder="Ex.: enviar proposta"
                required
              />
            </label>

            <label style={styles.field}>
              <span>Tipo</span>
              <select
                value={tipoTarefa}
                onChange={(event) => setTipoTarefa(event.target.value)}
                style={styles.input}
              >
                <option value="Ligação">Ligação</option>
                <option value="Visita">Visita</option>
                <option value="Mensagem">Mensagem</option>
                <option value="Proposta">Proposta</option>
              </select>
            </label>

            <label style={styles.field}>
              <span>Data</span>
              <input
                type="date"
                value={dataTarefa}
                onChange={(event) => setDataTarefa(event.target.value)}
                style={styles.input}
                required
              />
            </label>

            <Button type="submit">Criar tarefa</Button>
          </form>
        </Card>
      </section>

      <section style={styles.twoCols}>
        <Card>
          <h2 style={styles.sectionTitle}>Tarefas em aberto</h2>
          {tarefas.length === 0 ? (
            <p style={styles.emptyText}>Nenhuma tarefa pendente para este cliente.</p>
          ) : (
            <div style={styles.stack}>
              {tarefas.map((tarefa) => (
                <div key={tarefa.id} style={styles.listItem}>
                  <div>
                    <strong>{tarefa.titulo}</strong>
                    <p style={styles.itemText}>
                      {tarefa.tipo} • {formatarData(tarefa.data)}
                    </p>
                  </div>
                  <Button onClick={() => concluir(tarefa.id)}>Concluir</Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 style={styles.sectionTitle}>Linha do tempo</h2>
          {timeline.length === 0 ? (
            <p style={styles.emptyText}>Ainda não há histórico registrado.</p>
          ) : (
            <div style={styles.stack}>
              {timeline.map((item) => (
                <div key={item.id} style={styles.timelineItem}>
                  <div style={styles.timelineHeader}>
                    <strong>{item.tipo}</strong>
                    <span style={styles.timelineDate}>
                      {item.referencia
                        ? formatarData(item.referencia)
                        : formatarDataHora(item.criadoEm)}
                    </span>
                  </div>
                  <p style={styles.itemText}>{item.titulo}</p>
                  <small style={styles.createdLine}>
                    Registrado em {formatarDataHora(item.criadoEm)}
                  </small>
                </div>
              ))}
            </div>
          )}
        </Card>
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
    padding: 24,
    borderRadius: 20,
    border: "1px solid rgba(14,165,233,0.16)",
    background:
      "linear-gradient(135deg, rgba(14,165,233,0.10), rgba(16,185,129,0.08))",
  },
  backLink: {
    display: "inline-flex",
    marginBottom: 12,
    fontWeight: 700,
    textDecoration: "none",
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
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
  },
  sectionTitle: {
    margin: "0 0 8px",
  },
  sectionText: {
    margin: "0 0 18px",
    color: "#64748b",
    lineHeight: 1.6,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },
  formStack: {
    display: "grid",
    gap: 14,
  },
  field: {
    display: "grid",
    gap: 8,
    color: "#334155",
    fontWeight: 600,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    background: "#fff",
  },
  textarea: {
    width: "100%",
    minHeight: 110,
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    background: "#fff",
    resize: "vertical",
    fontFamily: "inherit",
  },
  formActions: {
    display: "flex",
    alignItems: "flex-end",
  },
  twoCols: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20,
  },
  stack: {
    display: "grid",
    gap: 12,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
  },
  timelineItem: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
  },
  timelineHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  timelineDate: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: 600,
  },
  itemText: {
    margin: "4px 0 0",
    color: "#475569",
    lineHeight: 1.6,
  },
  createdLine: {
    display: "block",
    marginTop: 8,
    color: "#64748b",
  },
  emptyText: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.6,
  },
};

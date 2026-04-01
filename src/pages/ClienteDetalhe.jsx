import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { criarContato, listarContatos } from "../services/contatos";
import {
  concluirTarefa,
  criarTarefa,
  listarTarefasDoCliente,
} from "../services/tarefas";
import { supabase } from "../supabaseClient";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function ClienteDetalhe() {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);
  const [tarefas, setTarefas] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [dataContato, setDataContato] = useState("");
  const [obs, setObs] = useState("");
  const [tituloTarefa, setTituloTarefa] = useState("");
  const [tipoTarefa, setTipoTarefa] = useState("Ligacao");
  const [dataTarefa, setDataTarefa] = useState("");

  async function carregarCliente() {
    const { data } = await supabase
      .from("clientes")
      .select("*")
      .eq("id", id)
      .single();

    setCliente(data);
  }

  function gerarTimeline(contatosData, tarefasData) {
    const contatosTimeline = contatosData.map((contato) => ({
      tipo: "contato",
      data: contato.data_contato,
      texto: `Contato: ${contato.observacao || "Sem observacao"}`,
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
      const { data } = await supabase
        .from("clientes")
        .select("*")
        .eq("id", id)
        .single();

      const contatosData = await listarContatos(id);
      const tarefasData = await listarTarefasDoCliente(id);

      if (!ativo) {
        return;
      }

      setCliente(data);
      setTarefas(tarefasData || []);
      gerarTimeline(contatosData || [], tarefasData || []);
    }

    carregarTudo();

    return () => {
      ativo = false;
    };
  }, [id]);

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

    await criarTarefa({
      cliente_id: id,
      titulo: tituloTarefa,
      tipo: tipoTarefa,
      data: dataTarefa,
    });

    setTituloTarefa("");
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

  return (
    <>
      {!cliente ? (
        <p>Carregando cliente...</p>
      ) : (
        <>
          <h1 style={{ marginBottom: 5 }}>{cliente.nome}</h1>
          <p style={{ marginBottom: 30 }}>
            <b>Empresa:</b> {cliente.empresa}
          </p>

          <h2 style={{ marginBottom: 15 }}>Historico do cliente</h2>

          {timeline.length === 0 ? (
            <Card>
              <p>Nenhuma atividade registrada.</p>
            </Card>
          ) : (
            timeline.map((item, index) => (
              <Card key={`${item.tipo}-${item.data}-${index}`}>
                <b>{item.data}</b> - {item.texto}
              </Card>
            ))
          )}

          <h2 style={{ marginTop: 40, marginBottom: 15 }}>Registrar contato</h2>

          <Card>
            <form
              onSubmit={registrarContato}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 15,
                alignItems: "center",
              }}
            >
              <input
                type="date"
                value={dataContato}
                onChange={(e) => setDataContato(e.target.value)}
                required
                style={inputStyle}
              />

              <input
                placeholder="Observacao"
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                style={{ ...inputStyle, minWidth: "250px" }}
              />

              <Button type="submit">Salvar</Button>
            </form>
          </Card>

          <h2 style={{ marginTop: 40, marginBottom: 15 }}>Tarefas pendentes</h2>

          {tarefas.length === 0 ? (
            <Card>
              <p>Nenhuma tarefa pendente.</p>
            </Card>
          ) : (
            tarefas.map((tarefa) => (
              <Card key={tarefa.id}>
                <div style={{ marginBottom: 10 }}>
                  <b>{tarefa.titulo}</b> ({tarefa.tipo})
                </div>

                <div style={{ marginBottom: 15 }}>Data: {tarefa.data}</div>

                <Button onClick={() => concluir(tarefa.id)}>Concluir</Button>
              </Card>
            ))
          )}

          <h3 style={{ marginTop: 30, marginBottom: 15 }}>Criar nova tarefa</h3>

          <Card>
            <form
              onSubmit={registrarTarefa}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 15,
                alignItems: "center",
              }}
            >
              <input
                placeholder="Titulo da tarefa"
                value={tituloTarefa}
                onChange={(e) => setTituloTarefa(e.target.value)}
                required
                style={{ ...inputStyle, minWidth: "220px" }}
              />

              <select
                value={tipoTarefa}
                onChange={(e) => setTipoTarefa(e.target.value)}
                style={inputStyle}
              >
                <option>Ligacao</option>
                <option>Visita</option>
                <option>Proposta</option>
                <option>Outro</option>
              </select>

              <input
                type="date"
                value={dataTarefa}
                onChange={(e) => setDataTarefa(e.target.value)}
                required
                style={inputStyle}
              />

              <Button type="submit">Criar tarefa</Button>
            </form>
          </Card>
        </>
      )}
    </>
  );
}

const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #cbd5e1",
};

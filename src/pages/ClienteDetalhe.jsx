import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { listarContatos, criarContato } from "../services/contatos";
import {
  criarTarefa,
  listarTarefasDoCliente,
  concluirTarefa,
} from "../services/tarefas";

import { supabase } from "../supabaseClient";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function ClienteDetalhe() {
  const { id } = useParams();

  const [cliente, setCliente] = useState(null);
  const [contatos, setContatos] = useState([]);
  const [tarefas, setTarefas] = useState([]);
  const [timeline, setTimeline] = useState([]);

  const [dataContato, setDataContato] = useState("");
  const [obs, setObs] = useState("");

  const [tituloTarefa, setTituloTarefa] = useState("");
  const [tipoTarefa, setTipoTarefa] = useState("Ligação");
  const [dataTarefa, setDataTarefa] = useState("");

  async function carregarCliente() {
    const { data } = await supabase
      .from("clientes")
      .select("*")
      .eq("id", id)
      .single();

    setCliente(data);
  }

  async function carregarContatos() {
    const data = await listarContatos(id);
    setContatos(data || []);
  }

  async function carregarTarefas() {
    const data = await listarTarefasDoCliente(id);
    setTarefas(data || []);
  }

  function gerarTimeline(contatosData, tarefasData) {
    const contatosTimeline = contatosData.map((c) => ({
      tipo: "contato",
      data: c.data_contato,
      texto: `Contato: ${c.observacao || "Sem observação"}`,
    }));

    const tarefasTimeline = tarefasData.map((t) => ({
      tipo: "tarefa",
      data: t.data,
      texto: `Tarefa: ${t.titulo} (${t.tipo})`,
    }));

    const combinado = [...contatosTimeline, ...tarefasTimeline];

    combinado.sort((a, b) => new Date(b.data) - new Date(a.data));

    setTimeline(combinado);
  }

  useEffect(() => {
    async function carregarTudo() {
      await carregarCliente();

      const contatosData = await listarContatos(id);
      const tarefasData = await listarTarefasDoCliente(id);

      setContatos(contatosData || []);
      setTarefas(tarefasData || []);

      gerarTimeline(contatosData || [], tarefasData || []);
    }

    carregarTudo();
  }, []);

  async function registrarContato(e) {
    e.preventDefault();

    await criarContato({
      cliente_id: id,
      data_contato: dataContato,
      observacao: obs,
    });

    setDataContato("");
    setObs("");

    const contatosData = await listarContatos(id);
    const tarefasData = await listarTarefasDoCliente(id);

    setContatos(contatosData);
    gerarTimeline(contatosData, tarefasData);
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

    const contatosData = await listarContatos(id);
    const tarefasData = await listarTarefasDoCliente(id);

    setTarefas(tarefasData);
    gerarTimeline(contatosData, tarefasData);
  }

  async function concluir(idTarefa) {
    await concluirTarefa(idTarefa);

    const contatosData = await listarContatos(id);
    const tarefasData = await listarTarefasDoCliente(id);

    setTarefas(tarefasData);
    gerarTimeline(contatosData, tarefasData);
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

          {/* TIMELINE */}
          <h2 style={{ marginBottom: 15 }}>🧠 Histórico do Cliente</h2>

          {timeline.length === 0 ? (
            <Card>
              <p>Nenhuma atividade registrada.</p>
            </Card>
          ) : (
            timeline.map((item, index) => (
              <Card key={index}>
                <b>{item.data}</b> — {item.texto}
              </Card>
            ))
          )}

          {/* CONTATO */}
          <h2 style={{ marginTop: 40, marginBottom: 15 }}>
            📞 Registrar Contato
          </h2>

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
                placeholder="Observação"
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                style={{ ...inputStyle, minWidth: "250px" }}
              />

              <Button type="submit">Salvar</Button>
            </form>
          </Card>

          {/* TAREFAS */}
          <h2 style={{ marginTop: 40, marginBottom: 15 }}>
            📅 Tarefas Pendentes
          </h2>

          {tarefas.length === 0 ? (
            <Card>
              <p>Nenhuma tarefa pendente 🎉</p>
            </Card>
          ) : (
            tarefas.map((t) => (
              <Card key={t.id}>
                <div style={{ marginBottom: 10 }}>
                  <b>{t.titulo}</b> ({t.tipo})
                </div>

                <div style={{ marginBottom: 15 }}>
                  Data: {t.data}
                </div>

                <Button onClick={() => concluir(t.id)}>
                  Concluir
                </Button>
              </Card>
            ))
          )}

          <h3 style={{ marginTop: 30, marginBottom: 15 }}>
            ➕ Criar Nova Tarefa
          </h3>

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
                placeholder="Título da tarefa"
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
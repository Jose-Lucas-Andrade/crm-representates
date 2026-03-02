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

  // contato
  const [dataContato, setDataContato] = useState("");
  const [obs, setObs] = useState("");

  // tarefa
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
    setContatos(data);
  }

  async function carregarTarefas() {
    const data = await listarTarefasDoCliente(id);
    setTarefas(data);
  }

  useEffect(() => {
    carregarCliente();
    carregarContatos();
    carregarTarefas();
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
    carregarContatos();
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
    carregarTarefas();
  }

  async function concluir(idTarefa) {
    await concluirTarefa(idTarefa);
    carregarTarefas();
  }

  if (!cliente) return <p>Carregando...</p>;

  return (
    <div style={{ padding: 30 }}>
      <h1>{cliente.nome}</h1>
      <p>
        <b>Empresa:</b> {cliente.empresa}
      </p>

      {/* ================= CONTATOS ================= */}
      <h2>📞 Registrar Contato</h2>
      <Card>
        <form onSubmit={registrarContato}>
          <input
            type="date"
            value={dataContato}
            onChange={(e) => setDataContato(e.target.value)}
            required
          />
          <input
            placeholder="Observação"
            value={obs}
            onChange={(e) => setObs(e.target.value)}
          />
          <Button type="submit">Salvar</Button>
        </form>
      </Card>

      <h3>Histórico de Contatos</h3>
      {contatos.length === 0 ? (
        <p>Nenhum contato ainda</p>
      ) : (
        contatos.map((c) => (
          <Card key={c.id}>
            📅 {c.data_contato} — {c.observacao}
          </Card>
        ))
      )}

      {/* ================= TAREFAS ================= */}
      <h2 style={{ marginTop: 30 }}>📅 Tarefas Pendentes</h2>

      {tarefas.length === 0 ? (
        <p>Nenhuma tarefa pendente 🎉</p>
      ) : (
        tarefas.map((t) => (
          <Card key={t.id}>
            <b>{t.titulo}</b> ({t.tipo})
            <br />
            Data: {t.data}
            <br /><br />
            <Button onClick={() => concluir(t.id)}>
              Concluir
            </Button>
          </Card>
        ))
      )}

      <h3>➕ Criar Nova Tarefa</h3>
      <Card>
        <form onSubmit={registrarTarefa}>
          <input
            placeholder="Título da tarefa"
            value={tituloTarefa}
            onChange={(e) => setTituloTarefa(e.target.value)}
            required
          />

          <select
            value={tipoTarefa}
            onChange={(e) => setTipoTarefa(e.target.value)}
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
          />

          <Button type="submit">Criar tarefa</Button>
        </form>
      </Card>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarClientes, excluirCliente } from "../services/clientes";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");

  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    const data = await listarClientes();
    setClientes(data);
  }

  async function remover(id) {
    if (confirm("Deseja excluir este cliente?")) {
      await excluirCliente(id);
      carregarClientes();
    }
  }

  // FILTRO
  const clientesFiltrados = clientes.filter((c) => {
    const texto = (c.nome + " " + (c.empresa || "")).toLowerCase();
    const buscaOk = texto.includes(busca.toLowerCase());
    const statusOk =
      filtroStatus === "Todos" || c.status === filtroStatus;

    return buscaOk && statusOk;
  });

  return (
    <div style={{ padding: 20 }}>
      <h1>Clientes</h1>

      {/* Barra de busca e filtros */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Buscar por nome ou empresa"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{ padding: 8, width: 250 }}
        />

        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          style={{ padding: 8 }}
        >
          <option>Todos</option>
          <option>Prospect</option>
          <option>Negociação</option>
          <option>Cliente</option>
          <option>Inativo</option>
        </select>

        <Link to="/clientes/novo">
          <Button>Novo Cliente</Button>
        </Link>
      </div>

      {clientesFiltrados.length === 0 ? (
        <p>Nenhum cliente encontrado</p>
      ) : (
        clientesFiltrados.map((c) => (
          <Card key={c.id}>
            <b>{c.nome}</b> — {c.empresa}
            <br />
            Status: <b>{c.status}</b>
            <br /><br />

            <Link to={`/clientes/${c.id}`}>Ver</Link>{" "}
            | <Link to={`/clientes/${c.id}/editar`}>Editar</Link>{" "}
            |{" "}
            <Button variant="danger" onClick={() => remover(c.id)}>
              Excluir
            </Button>
          </Card>
        ))
      )}
    </div>
  );
}
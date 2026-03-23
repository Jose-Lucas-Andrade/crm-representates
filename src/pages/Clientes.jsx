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
    <>
      <h1 style={{ marginBottom: "25px" }}>Clientes</h1>

      {/* Barra de busca e filtros */}
      <Card>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 15,
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Buscar por nome ou empresa"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{
              padding: "10px",
              width: "250px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
            }}
          />

          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
            }}
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
      </Card>

      {/* Lista */}
      <div style={{ marginTop: 25 }}>
        {clientesFiltrados.length === 0 ? (
          <Card>
            <p>Nenhum cliente encontrado.</p>
          </Card>
        ) : (
          clientesFiltrados.map((c) => (
            <Card key={c.id}>
              <div style={{ marginBottom: 10 }}>
                <b>{c.nome}</b> — {c.empresa}
              </div>

              <div style={{ marginBottom: 15 }}>
                Status: <b>{c.status}</b>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <Link to={`/clientes/${c.id}`}>
                  <Button variant="secondary">Ver</Button>
                </Link>

                <Link to={`/clientes/${c.id}/editar`}>
                  <Button variant="secondary">Editar</Button>
                </Link>

                <Button
                  variant="danger"
                  onClick={() => remover(c.id)}
                >
                  Excluir
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
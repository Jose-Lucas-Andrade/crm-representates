import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { excluirCliente, listarClientes } from "../services/clientes";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import {
  CLIENTE_STATUS_OPTIONS,
  getClienteClassificacaoLabel,
  getClienteStatusLabel,
} from "../constants/clientes";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");

  useEffect(() => {
    let ativo = true;

    async function carregarClientes() {
      const data = await listarClientes();
      if (ativo) {
        setClientes(data);
      }
    }

    carregarClientes();

    return () => {
      ativo = false;
    };
  }, []);

  async function remover(id) {
    if (confirm("Deseja excluir este cliente?")) {
      await excluirCliente(id);
      const data = await listarClientes();
      setClientes(data);
    }
  }

  const clientesFiltrados = clientes.filter((cliente) => {
    const texto = `${cliente.nome} ${cliente.empresa || ""}`.toLowerCase();
    const buscaOk = texto.includes(busca.toLowerCase());
    const statusOk =
      filtroStatus === "Todos" || cliente.status === filtroStatus;

    return buscaOk && statusOk;
  });

  return (
    <>
      <div style={styles.header}>
        <div>
          <h1 style={{ marginBottom: 6 }}>Clientes</h1>
          <p style={styles.subtitle}>
            Acompanhe sua carteira, filtre prioridades e avance negociacoes com mais clareza.
          </p>
        </div>
      </div>

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
            <option value="Todos">Todos</option>
            {CLIENTE_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <Link to="/clientes/novo">
            <Button>Novo Cliente</Button>
          </Link>
        </div>
      </Card>

      <div style={{ marginTop: 25 }}>
        {clientesFiltrados.length === 0 ? (
          <Card>
            <p>Nenhum cliente encontrado.</p>
          </Card>
        ) : (
          clientesFiltrados.map((cliente) => (
            <Card key={cliente.id}>
              <div style={{ marginBottom: 10 }}>
                <b>{cliente.nome}</b> - {cliente.empresa}
              </div>

              <div style={{ marginBottom: 15 }}>
                Status: <b>{getClienteStatusLabel(cliente.status)}</b>
              </div>

              <div style={{ marginBottom: 18 }}>
                Classificacao:{" "}
                <b>{getClienteClassificacaoLabel(cliente.classificacao)}</b>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <Link to={`/clientes/${cliente.id}`}>
                  <Button variant="secondary">Ver</Button>
                </Link>

                <Link to={`/clientes/${cliente.id}/editar`}>
                  <Button variant="secondary">Editar</Button>
                </Link>

                <Button variant="danger" onClick={() => remover(cliente.id)}>
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

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 25,
  },
  subtitle: {
    margin: 0,
    color: "#64748b",
    maxWidth: 620,
  },
};

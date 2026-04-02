import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import {
  CLIENTE_STATUS_OPTIONS,
  getClienteClassificacaoLabel,
  getClienteStatusLabel,
} from "../constants/clientes";
import { excluirCliente, listarClientes } from "../services/clientes";

function formatarData(data) {
  if (!data) {
    return "Não definida";
  }

  return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
}

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");

  useEffect(() => {
    let ativo = true;

    async function carregarClientes() {
      const data = await listarClientes();
      if (ativo) {
        setClientes(data || []);
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
      setClientes(data || []);
    }
  }

  const clientesFiltrados = clientes.filter((cliente) => {
    const texto = `${cliente.nome} ${cliente.empresa || ""}`.toLowerCase();
    const buscaOk = texto.includes(busca.toLowerCase());
    const statusOk = filtroStatus === "Todos" || cliente.status === filtroStatus;

    return buscaOk && statusOk;
  });

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Clientes</h1>
          <p style={styles.subtitle}>
            Acompanhe sua carteira, filtre prioridades e avance negociações com
            mais clareza.
          </p>
        </div>
      </div>

      <Card>
        <div style={styles.filterBar}>
          <input
            type="text"
            placeholder="Buscar por nome ou empresa"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={styles.input}
          />

          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            style={styles.select}
          >
            <option value="Todos">Todos</option>
            {CLIENTE_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <Link to="/clientes/novo" style={styles.newClientLink}>
            <Button>Novo cliente</Button>
          </Link>
        </div>
      </Card>

      <div style={styles.listWrapper}>
        {clientesFiltrados.length === 0 ? (
          <Card>
            <p>Nenhum cliente encontrado.</p>
          </Card>
        ) : (
          <div style={styles.cardList}>
            {clientesFiltrados.map((cliente) => (
              <Card key={cliente.id}>
                <div style={styles.cardHeader}>
                  <div>
                    <b>{cliente.nome}</b>
                    <p style={styles.companyLine}>{cliente.empresa || "Empresa não informada"}</p>
                  </div>
                  <span style={styles.statusBadge}>
                    {getClienteStatusLabel(cliente.status)}
                  </span>
                </div>

                <div style={styles.infoBlock}>
                  <p style={styles.infoLine}>
                    Classificação:{" "}
                    <b>{getClienteClassificacaoLabel(cliente.classificacao)}</b>
                  </p>
                  <p style={styles.infoLine}>
                    Próxima ação: <b>{cliente.proxima_acao || "Não definida"}</b>
                  </p>
                  <p style={styles.infoLine}>
                    Próxima visita: <b>{formatarData(cliente.proxima_visita)}</b>
                  </p>
                </div>

                <div style={styles.actions}>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 25,
  },
  title: {
    margin: "0 0 6px",
  },
  subtitle: {
    margin: 0,
    color: "#64748b",
    maxWidth: 620,
    lineHeight: 1.6,
  },
  filterBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: 15,
    alignItems: "center",
  },
  input: {
    padding: "10px 12px",
    width: "100%",
    maxWidth: "320px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
  },
  select: {
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    minWidth: "170px",
  },
  newClientLink: {
    textDecoration: "none",
  },
  listWrapper: {
    marginTop: 25,
  },
  cardList: {
    display: "grid",
    gap: 16,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 14,
    flexWrap: "wrap",
    marginBottom: 14,
  },
  companyLine: {
    margin: "6px 0 0",
    color: "#64748b",
  },
  statusBadge: {
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#dbeafe",
    color: "#1d4ed8",
    fontSize: "12px",
    fontWeight: "bold",
  },
  infoBlock: {
    marginBottom: 18,
  },
  infoLine: {
    margin: "0 0 10px",
    color: "#475569",
    lineHeight: 1.6,
  },
  actions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
};

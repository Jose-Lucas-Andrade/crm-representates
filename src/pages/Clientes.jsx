import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import ImportarClientesModal from "../components/clientes/ImportarClientesModal";
import {
  CLIENTE_STATUS_OPTIONS,
  getClienteClassificacaoLabel,
  getClienteStatusLabel,
} from "../constants/clientes";
import { excluirCliente, listarClientes } from "../services/clientes";

function formatarData(data) {
  if (!data) {
    return "Nao definida";
  }

  return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
}

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [modalImportacaoAberto, setModalImportacaoAberto] = useState(false);

  async function carregarClientes() {
    const data = await listarClientes();
    setClientes(data || []);
  }

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const data = await listarClientes();
      if (ativo) {
        setClientes(data || []);
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, []);

  async function handleExcluir(id) {
    const confirmou = window.confirm(
      "Tem certeza que deseja excluir este cliente?"
    );

    if (!confirmou) {
      return;
    }

    const ok = await excluirCliente(id);
    if (!ok) {
      return;
    }

    const data = await listarClientes();
    setClientes(data || []);
  }

  const clientesFiltrados = clientes.filter((cliente) => {
    const buscaNormalizada = busca.trim().toLowerCase();
    const nomeEmpresa =
      `${cliente.nome || ""} ${cliente.empresa || ""}`.toLowerCase();
    const atendeBusca =
      !buscaNormalizada || nomeEmpresa.includes(buscaNormalizada);
    const atendeStatus = !filtroStatus || cliente.status === filtroStatus;

    return atendeBusca && atendeStatus;
  });

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div>
          <h1 style={styles.title}>Clientes</h1>
          <p style={styles.subtitle}>
            Acompanhe a carteira, encontre rapido quem precisa de atencao e
            mantenha o proximo passo sempre visivel.
          </p>
        </div>
      </section>

      <section style={styles.filters}>
        <input
          type="text"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          placeholder="Buscar por nome ou empresa"
          style={styles.input}
        />

        <select
          value={filtroStatus}
          onChange={(event) => setFiltroStatus(event.target.value)}
          style={styles.select}
        >
          <option value="">Todos os status</option>
          {CLIENTE_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <Link to="/clientes/novo" style={styles.newClientLink}>
          <Button>Novo cliente</Button>
        </Link>

        <Button
          variant="secondary"
          onClick={() => setModalImportacaoAberto(true)}
        >
          Importar clientes
        </Button>
      </section>

      <section style={styles.list}>
        {clientesFiltrados.length === 0 ? (
          <Card>
            <p style={styles.emptyText}>Nenhum cliente encontrado.</p>
          </Card>
        ) : (
          clientesFiltrados.map((cliente) => (
            <Card key={cliente.id}>
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={styles.cardTitle}>{cliente.nome}</h3>
                  <p style={styles.companyLine}>
                    {cliente.empresa || "Empresa nao informada"}
                  </p>
                </div>
                <span style={styles.statusBadge}>
                  {getClienteStatusLabel(cliente.status)}
                </span>
              </div>

              <div style={styles.metaGrid}>
                <p style={styles.metaLine}>
                  Classificacao:{" "}
                  <b>{getClienteClassificacaoLabel(cliente.classificacao)}</b>
                </p>
                <p style={styles.metaLine}>
                  Proxima acao: <b>{cliente.proxima_acao || "Nao definida"}</b>
                </p>
                <p style={styles.metaLine}>
                  Proxima visita: <b>{formatarData(cliente.proxima_visita)}</b>
                </p>
                <p style={styles.metaLine}>
                  Cidade: <b>{cliente.cidade || "Nao informada"}</b>
                </p>
              </div>

              <div style={styles.actions}>
                <Link to={`/clientes/${cliente.id}`} style={styles.actionLink}>
                  Ver cliente
                </Link>
                <Link
                  to={`/clientes/${cliente.id}/editar`}
                  style={styles.actionLinkSecondary}
                >
                  Editar
                </Link>
                <Button
                  variant="danger"
                  onClick={() => handleExcluir(cliente.id)}
                >
                  Excluir
                </Button>
              </div>
            </Card>
          ))
        )}
      </section>

      <ImportarClientesModal
        aberto={modalImportacaoAberto}
        onFechar={() => setModalImportacaoAberto(false)}
        clientesExistentes={clientes}
        onImportado={carregarClientes}
      />
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
      "linear-gradient(135deg, rgba(14,165,233,0.10), rgba(37,99,235,0.06))",
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
  filters: {
    display: "grid",
    gridTemplateColumns:
      "minmax(220px, 1.4fr) minmax(180px, 0.7fr) auto auto",
    gap: 12,
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    background: "#fff",
  },
  select: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    background: "#fff",
  },
  newClientLink: {
    textDecoration: "none",
  },
  list: {
    display: "grid",
    gap: 16,
  },
  emptyText: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.6,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 14,
  },
  cardTitle: {
    margin: "0 0 6px",
  },
  companyLine: {
    margin: 0,
    color: "#64748b",
  },
  statusBadge: {
    padding: "6px 10px",
    borderRadius: 999,
    background: "#dbeafe",
    color: "#1d4ed8",
    fontSize: 12,
    fontWeight: 700,
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 10,
    marginBottom: 16,
  },
  metaLine: {
    margin: 0,
    color: "#334155",
    lineHeight: 1.6,
  },
  actions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
  },
  actionLink: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 14px",
    borderRadius: 10,
    background: "#2563eb",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 700,
  },
  actionLinkSecondary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 14px",
    borderRadius: 10,
    background: "#e2e8f0",
    color: "#0f172a",
    textDecoration: "none",
    fontWeight: 700,
  },
};

import { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  CLIENTE_STATUS,
  CLIENTE_STATUS_OPTIONS,
} from "../constants/clientes";
import { listarClientesPorStatus, atualizarStatus } from "../services/oportunidades";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 900);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 900);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

export default function Opportunities() {
  const [clientes, setClientes] = useState([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const data = await listarClientesPorStatus();
      if (ativo) {
        setClientes(data || []);
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, []);

  async function mover(clienteId, novoStatus) {
    await atualizarStatus(clienteId, novoStatus);
    const data = await listarClientesPorStatus();
    setClientes(data || []);
  }

  const prospect = clientes.filter((cliente) => cliente.status === CLIENTE_STATUS.PROSPECT);
  const negociacao = clientes.filter((cliente) => cliente.status === CLIENTE_STATUS.NEGOCIACAO);
  const clientesAtivos = clientes.filter((cliente) => cliente.status === CLIENTE_STATUS.CLIENTE);

  function handleDragEnd(event) {
    if (isMobile) {
      return;
    }

    const { active, over } = event;

    if (!over) {
      return;
    }

    mover(active.id, over.id);
  }

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <h1 style={styles.title}>Oportunidades</h1>
        <p style={styles.subtitle}>
          Acompanhe o pipeline comercial com clareza e ajuste o status dos clientes
          sem sair da carteira.
        </p>
      </section>

      {isMobile ? (
        <div style={styles.mobileHint}>
          No celular, o pipeline fica empilhado para facilitar leitura e mudança de status.
        </div>
      ) : (
        <div style={styles.mobileHint}>
          No desktop, você pode arrastar os clientes entre as colunas.
        </div>
      )}

      <div style={styles.infoBox}>
        Clientes com status <b>Inativo</b> saem deste quadro e continuam visíveis na
        carteira de clientes.
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div
          style={{
            ...styles.board,
            ...(isMobile ? styles.boardMobile : {}),
          }}
        >
          <Coluna
            id={CLIENTE_STATUS.PROSPECT}
            titulo="Prospect"
            clientes={prospect}
            onMover={mover}
          />

          <Coluna
            id={CLIENTE_STATUS.NEGOCIACAO}
            titulo="Negociação"
            clientes={negociacao}
            onMover={mover}
          />

          <Coluna
            id={CLIENTE_STATUS.CLIENTE}
            titulo="Cliente"
            clientes={clientesAtivos}
            onMover={mover}
          />
        </div>
      </DndContext>
    </div>
  );
}

function Coluna({ id, titulo, clientes, onMover }) {
  return (
    <section style={styles.coluna} id={id}>
      <div style={styles.colunaHeader}>
        <h2 style={styles.colunaTitle}>{titulo}</h2>
        <span style={styles.countBadge}>{clientes.length}</span>
      </div>

      {clientes.length === 0 ? (
        <div style={styles.emptyCard}>Nenhum cliente nesta etapa.</div>
      ) : (
        clientes.map((cliente) => (
          <div key={cliente.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <b>{cliente.nome}</b>
              <span style={styles.statusPill}>{titulo}</span>
            </div>

            <p style={styles.companyLine}>{cliente.empresa || "Empresa não informada"}</p>

            <select
              value={cliente.status}
              onChange={(e) => onMover(cliente.id, e.target.value)}
              style={styles.select}
            >
              {CLIENTE_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))
      )}
    </section>
  );
}

const styles = {
  page: {
    width: "100%",
    maxWidth: "1160px",
    margin: "0 auto",
  },
  hero: {
    marginBottom: 20,
    padding: "24px",
    borderRadius: "20px",
    background:
      "linear-gradient(135deg, rgba(99,102,241,0.10), rgba(14,165,233,0.08))",
    border: "1px solid rgba(99,102,241,0.16)",
  },
  title: {
    margin: "0 0 8px",
  },
  subtitle: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.6,
    maxWidth: 720,
  },
  mobileHint: {
    marginBottom: 20,
    padding: "12px 14px",
    borderRadius: "12px",
    background: "#eef2ff",
    color: "#4338ca",
    fontSize: "14px",
    lineHeight: 1.5,
  },
  infoBox: {
    marginBottom: 20,
    padding: "12px 14px",
    borderRadius: "12px",
    background: "#fff7ed",
    color: "#9a3412",
    fontSize: "14px",
    lineHeight: 1.5,
    border: "1px solid #fed7aa",
  },
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 20,
    alignItems: "start",
  },
  boardMobile: {
    gridTemplateColumns: "1fr",
    gap: 16,
  },
  coluna: {
    background: "#f8fafc",
    padding: 16,
    borderRadius: 16,
    minHeight: 420,
    border: "1px solid #e2e8f0",
  },
  colunaHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  colunaTitle: {
    margin: 0,
    fontSize: "20px",
  },
  countBadge: {
    padding: "5px 10px",
    borderRadius: "999px",
    background: "#dbeafe",
    color: "#1d4ed8",
    fontSize: "12px",
    fontWeight: "bold",
  },
  emptyCard: {
    padding: "16px",
    borderRadius: "12px",
    background: "#fff",
    border: "1px dashed #cbd5e1",
    color: "#64748b",
  },
  card: {
    background: "#fff",
    padding: 14,
    marginBottom: 12,
    borderRadius: 12,
    boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
    border: "1px solid #e2e8f0",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 10,
  },
  statusPill: {
    padding: "4px 8px",
    borderRadius: "999px",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontSize: "11px",
    fontWeight: "bold",
  },
  companyLine: {
    margin: "0 0 12px",
    color: "#64748b",
    lineHeight: 1.5,
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    background: "#fff",
  },
};

import { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { listarClientesPorStatus, atualizarStatus } from "../services/oportunidades";
import {
  CLIENTE_STATUS,
  CLIENTE_STATUS_OPTIONS,
} from "../constants/clientes";

export default function Opportunities() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const data = await listarClientesPorStatus();
      if (ativo) {
        setClientes(data);
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
    setClientes(data);
  }

  const prospect = clientes.filter((cliente) => cliente.status === CLIENTE_STATUS.PROSPECT);
  const negociacao = clientes.filter((cliente) => cliente.status === CLIENTE_STATUS.NEGOCIACAO);
  const clientesAtivos = clientes.filter((cliente) => cliente.status === CLIENTE_STATUS.CLIENTE);

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;

    mover(active.id, over.id);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 25 }}>Oportunidades</h1>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div style={board}>
          <Coluna
            id={CLIENTE_STATUS.PROSPECT}
            titulo="Prospect"
            clientes={prospect}
            onMover={mover}
          />

          <Coluna
            id={CLIENTE_STATUS.NEGOCIACAO}
            titulo="Negociacao"
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
    <div style={coluna} id={id}>
      <h2>{titulo}</h2>

      <SortableContext
        items={clientes.map((cliente) => cliente.id)}
        strategy={verticalListSortingStrategy}
      >
        {clientes.map((cliente) => (
          <div key={cliente.id} style={card}>
            <b>{cliente.nome}</b>
            <p>{cliente.empresa}</p>

            <select
              value={cliente.status}
              onChange={(e) => onMover(cliente.id, e.target.value)}
            >
              {CLIENTE_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </SortableContext>
    </div>
  );
}

const board = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 20,
};

const coluna = {
  background: "#f4f6f8",
  padding: 15,
  borderRadius: 10,
  minHeight: 450,
};

const card = {
  background: "#fff",
  padding: 12,
  marginBottom: 10,
  borderRadius: 6,
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

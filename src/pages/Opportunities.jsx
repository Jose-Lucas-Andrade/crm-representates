import { useEffect, useState } from "react";
import { listarClientesPorStatus, atualizarStatus } from "../services/oportunidades";

import {
  DndContext,
  closestCenter
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

export default function Opportunities() {

  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const data = await listarClientesPorStatus();
    setClientes(data);
  }

  async function mover(cliente_id, novoStatus) {
    await atualizarStatus(cliente_id, novoStatus);
    carregar();
  }

  const prospect = clientes.filter(c => c.status === "Prospect");
  const negociacao = clientes.filter(c => c.status === "Negociação");
  const cliente = clientes.filter(c => c.status === "Cliente");

  function handleDragEnd(event) {

    const { active, over } = event;

    if (!over) return;

    const cliente_id = active.id;
    const novoStatus = over.id;

    mover(cliente_id, novoStatus);
  }

  return (
    <div style={{ padding: 20 }}>

      <h1 style={{ marginBottom: 25 }}>Oportunidades</h1>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >

        <div style={board}>

          <Coluna
            id="Prospect"
            titulo="Prospect"
            clientes={prospect}
            onMover={mover}
          />

          <Coluna
            id="Negociação"
            titulo="Negociação"
            clientes={negociacao}
            onMover={mover}
          />

          <Coluna
            id="Cliente"
            titulo="Cliente"
            clientes={cliente}
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
        items={clientes.map(c => c.id)}
        strategy={verticalListSortingStrategy}
      >

        {clientes.map(c => (

          <div key={c.id} style={card}>

            <b>{c.nome}</b>
            <p>{c.empresa}</p>

            <select
              value={c.status}
              onChange={(e) => onMover(c.id, e.target.value)}
            >
              <option>Prospect</option>
              <option>Negociação</option>
              <option>Cliente</option>
              <option>Inativo</option>
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
  gap: 20
};

const coluna = {
  background: "#f4f6f8",
  padding: 15,
  borderRadius: 10,
  minHeight: 450
};

const card = {
  background: "#fff",
  padding: 12,
  marginBottom: 10,
  borderRadius: 6,
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
};
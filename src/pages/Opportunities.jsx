import { useEffect, useState } from "react";
import { listarClientesPorStatus, atualizarStatus } from "../services/oportunidades";

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

  return (
    <div style={{ padding: 20 }}>
      <h1>Pipeline de Vendas</h1>

      <div style={board}>
        <Coluna
          titulo="Prospect"
          clientes={prospect}
          onMover={mover}
          cor="#3498db"
        />

        <Coluna
          titulo="Negociação"
          clientes={negociacao}
          onMover={mover}
          cor="#f39c12"
        />

        <Coluna
          titulo="Cliente"
          clientes={cliente}
          onMover={mover}
          cor="#2ecc71"
        />
      </div>
    </div>
  );
}

function Coluna({ titulo, clientes, onMover, cor }) {
  return (
    <div style={coluna}>
      <h2 style={{ color: cor }}>{titulo}</h2>

      {clientes.length === 0 && <p>Nenhum</p>}

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
    </div>
  );
}

const board = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 20,
  marginTop: 20
};

const coluna = {
  background: "#f4f6f8",
  padding: 15,
  borderRadius: 10,
  minHeight: 400
};

const card = {
  background: "#fff",
  padding: 10,
  marginBottom: 10,
  borderRadius: 6,
  boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
};
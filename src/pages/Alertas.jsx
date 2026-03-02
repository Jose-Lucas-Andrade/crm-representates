import { useEffect, useState } from "react";
import { listarClientesSemContato } from "../services/alertas";
import { useNavigate } from "react-router-dom";

export default function Alertas() {
  const [clientes, setClientes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const data = await listarClientesSemContato();

    // Mostrar apenas quem precisa de atenção
    const filtrados = data.filter(c => c.dias >= 15);

    setClientes(filtrados);
  }

  function nivel(dias) {
    if (dias >= 30) return { texto: "URGENTE", cor: "#e74c3c" };
    if (dias >= 15) return { texto: "ATENÇÃO", cor: "#f39c12" };
    return { texto: "OK", cor: "#2ecc71" };
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Alertas de Follow-up</h1>

      {clientes.length === 0 ? (
        <p>Todos os clientes estão em dia 👍</p>
      ) : (
        <div style={grid}>
          {clientes.map(cliente => {
            const status = nivel(cliente.dias);

            return (
              <div key={cliente.cliente_id} style={card}>
                <h3>{cliente.nome}</h3>
                <p>{cliente.empresa}</p>

                <p>
                  <b>{cliente.dias} dias sem contato</b>
                </p>

                <span style={{ color: status.cor, fontWeight: "bold" }}>
                  {status.texto}
                </span>

                <br /><br />

                <button
                  onClick={() =>
                    navigate(`/clientes/${cliente.cliente_id}/contato`)
                  }
                >
                  Registrar contato
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: 20,
  marginTop: 20
};

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
};
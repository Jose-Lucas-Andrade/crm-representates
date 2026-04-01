import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarClientesSemContato } from "../services/alertas";

export default function Alertas() {
  const [clientes, setClientes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const data = await listarClientesSemContato();

        if (!ativo) {
          return;
        }

        if (!data) {
          setClientes([]);
          return;
        }

        const filtrados = data.filter((cliente) => cliente.dias >= 15);
        setClientes(filtrados);
      } catch (erro) {
        console.error("Erro ao carregar alertas:", erro);
        if (ativo) {
          setClientes([]);
        }
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, []);

  function nivel(dias) {
    if (dias >= 30) {
      return {
        texto: "URGENTE",
        cor: "#dc2626",
        bg: "#fee2e2",
      };
    }

    if (dias >= 15) {
      return {
        texto: "ATENCAO",
        cor: "#d97706",
        bg: "#fef3c7",
      };
    }

    return {
      texto: "OK",
      cor: "#16a34a",
      bg: "#dcfce7",
    };
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Alertas de follow-up</h1>
        <p style={styles.subtitle}>
          Clientes que precisam de contato para nao perder oportunidades
        </p>
      </div>

      {clientes.length === 0 ? (
        <div style={styles.empty}>
          <p>Todos os clientes estao em dia.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {clientes.map((cliente) => {
            const status = nivel(cliente.dias);

            return (
              <div key={cliente.cliente_id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3>{cliente.nome}</h3>
                  <span
                    style={{
                      ...styles.badge,
                      color: status.cor,
                      background: status.bg,
                    }}
                  >
                    {status.texto}
                  </span>
                </div>

                <p style={styles.empresa}>{cliente.empresa || "Sem empresa"}</p>
                <p style={styles.dias}>{cliente.dias} dias sem contato</p>

                <button
                  style={styles.button}
                  onClick={() => navigate(`/clientes/${cliente.cliente_id}`)}
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

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  header: {
    marginBottom: "10px",
  },
  title: {
    marginBottom: "5px",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "14px",
  },
  empty: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  empresa: {
    color: "#64748b",
    fontSize: "14px",
  },
  dias: {
    fontWeight: "bold",
    fontSize: "16px",
  },
  button: {
    marginTop: "10px",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

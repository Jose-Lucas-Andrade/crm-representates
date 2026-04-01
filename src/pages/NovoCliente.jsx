import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { criarCliente } from "../services/clientes";
import {
  CLIENTE_STATUS,
  CLIENTE_STATUS_OPTIONS,
} from "../constants/clientes";

export default function NovoCliente() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cidade, setCidade] = useState("");
  const [status, setStatus] = useState(CLIENTE_STATUS.PROSPECT);

  async function handleSubmit(e) {
    e.preventDefault();

    const ok = await criarCliente({
      nome,
      empresa,
      telefone,
      email,
      cidade,
      status,
    });

    if (ok) {
      navigate("/clientes");
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Novo Cliente</h1>
        <p style={styles.subtitle}>
          Preencha os dados para cadastrar um novo cliente
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label>Nome *</label>
              <input
                style={styles.input}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div style={styles.field}>
              <label>Empresa</label>
              <input
                style={styles.input}
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label>Telefone</label>
              <input
                style={styles.input}
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>

            <div style={styles.field}>
              <label>Email</label>
              <input
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label>Cidade</label>
              <input
                style={styles.input}
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
            </div>

            <div style={styles.field}>
              <label>Status</label>
              <select
                style={styles.input}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {CLIENTE_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.actions}>
            <button type="submit" style={styles.button}>
              Salvar cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: "700px",
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  title: {
    marginBottom: "5px",
  },
  subtitle: {
    marginBottom: "25px",
    color: "#64748b",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  row: {
    display: "flex",
    gap: "15px",
  },
  field: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    fontSize: "14px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
  },
  actions: {
    marginTop: "10px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

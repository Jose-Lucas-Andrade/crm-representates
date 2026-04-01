import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { atualizarCliente, listarClientes } from "../services/clientes";
import {
  CLIENTE_STATUS,
  CLIENTE_STATUS_OPTIONS,
} from "../constants/clientes";

export default function EditarCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    async function carregar() {
      const lista = await listarClientes();
      const cliente = lista.find((item) => item.id === id);
      setForm(cliente ?? null);
    }

    carregar();
  }, [id]);

  async function salvar(e) {
    e.preventDefault();
    await atualizarCliente(id, form);
    navigate("/clientes");
  }

  if (!form) return <p style={styles.loading}>Carregando...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Editar Cliente</h2>

        <form onSubmit={salvar} style={styles.form}>
          <div style={styles.group}>
            <label>Nome</label>
            <input
              style={styles.input}
              value={form.nome || ""}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />
          </div>

          <div style={styles.group}>
            <label>Empresa</label>
            <input
              style={styles.input}
              value={form.empresa || ""}
              onChange={(e) => setForm({ ...form, empresa: e.target.value })}
            />
          </div>

          <div style={styles.group}>
            <label>Email</label>
            <input
              style={styles.input}
              value={form.email || ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div style={styles.group}>
            <label>Telefone</label>
            <input
              style={styles.input}
              value={form.telefone || ""}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            />
          </div>

          <div style={styles.group}>
            <label>Cidade</label>
            <input
              style={styles.input}
              value={form.cidade || ""}
              onChange={(e) => setForm({ ...form, cidade: e.target.value })}
            />
          </div>

          <div style={styles.group}>
            <label>Status</label>
            <select
              style={styles.select}
              value={form.status || CLIENTE_STATUS.PROSPECT}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {CLIENTE_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" style={styles.button}>
            Salvar alteracoes
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: "500px",
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  title: {
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  group: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginTop: "5px",
  },
  select: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginTop: "5px",
  },
  button: {
    marginTop: "15px",
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  loading: {
    padding: "20px",
  },
};

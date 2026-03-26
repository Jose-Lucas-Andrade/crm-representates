import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { listarClientes, atualizarCliente } from "../services/clientes";

export default function EditarCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    async function carregar() {
      const lista = await listarClientes();
      const cliente = lista.find((c) => c.id === id);
      setForm(cliente);
    }
    carregar();
  }, [id]);

  async function salvar(e) {
    e.preventDefault();
    await atualizarCliente(id, form);
    navigate("/clientes"); // ✅ corrigido
  }

  if (!form) return <p style={styles.loading}>Carregando...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>✏️ Editar Cliente</h2>

        <form onSubmit={salvar} style={styles.form}>
          <div style={styles.group}>
            <label>Nome</label>
            <input
              style={styles.input}
              value={form.nome || ""}
              onChange={(e) =>
                setForm({ ...form, nome: e.target.value })
              }
              required
            />
          </div>

          <div style={styles.group}>
            <label>Empresa</label>
            <input
              style={styles.input}
              value={form.empresa || ""}
              onChange={(e) =>
                setForm({ ...form, empresa: e.target.value })
              }
            />
          </div>

          <div style={styles.group}>
            <label>Email</label>
            <input
              style={styles.input}
              value={form.email || ""}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div style={styles.group}>
            <label>Telefone</label>
            <input
              style={styles.input}
              value={form.telefone || ""}
              onChange={(e) =>
                setForm({ ...form, telefone: e.target.value })
              }
            />
          </div>

          <div style={styles.group}>
            <label>Cidade</label>
            <input
              style={styles.input}
              value={form.cidade || ""}
              onChange={(e) =>
                setForm({ ...form, cidade: e.target.value })
              }
            />
          </div>

          <div style={styles.group}>
            <label>Status</label>
            <select
              style={styles.select}
              value={form.status || "Prospect"}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option value="Prospect">Prospect</option>
              <option value="Contato">Contato</option>
              <option value="Negociação">Negociação</option>
              <option value="Cliente">Cliente</option>
              <option value="Perdido">Perdido</option>
            </select>
          </div>

          <button type="submit" style={styles.button}>
            💾 Salvar Alterações
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
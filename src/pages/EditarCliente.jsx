import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CLIENTE_CLASSIFICACAO,
  CLIENTE_CLASSIFICACAO_OPTIONS,
  CLIENTE_STATUS,
  CLIENTE_STATUS_OPTIONS,
} from "../constants/clientes";
import { atualizarCliente, listarClientes } from "../services/clientes";

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

  if (!form) {
    return <p style={styles.loading}>Carregando...</p>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Editar cliente</h1>
        <p style={styles.subtitle}>
          Atualize os dados mais importantes para manter a carteira organizada e
          o próximo passo bem definido.
        </p>

        <form onSubmit={salvar} style={styles.form}>
          <div style={styles.row}>
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
          </div>

          <div style={styles.row}>
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
          </div>

          <div style={styles.row}>
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
          </div>

          <div style={styles.row}>
            <div style={styles.group}>
              <label>Classificação</label>
              <select
                style={styles.select}
                value={form.classificacao || CLIENTE_CLASSIFICACAO.MORNO}
                onChange={(e) =>
                  setForm({ ...form, classificacao: e.target.value })
                }
              >
                {CLIENTE_CLASSIFICACAO_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.group}>
              <label>Próxima ação</label>
              <input
                style={styles.input}
                value={form.proxima_acao || ""}
                onChange={(e) =>
                  setForm({ ...form, proxima_acao: e.target.value })
                }
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.group}>
              <label>Próxima visita</label>
              <input
                type="date"
                style={styles.input}
                value={form.proxima_visita || ""}
                onChange={(e) =>
                  setForm({ ...form, proxima_visita: e.target.value })
                }
              />
            </div>
          </div>

          <button type="submit" style={styles.button}>
            Salvar alterações
          </button>
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
    maxWidth: "760px",
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
  },
  title: {
    marginBottom: "6px",
  },
  subtitle: {
    marginBottom: "24px",
    color: "#64748b",
    lineHeight: 1.6,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
  },
  group: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  input: {
    padding: "11px 12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
  },
  select: {
    padding: "11px 12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
  },
  button: {
    marginTop: "10px",
    padding: "13px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  loading: {
    padding: "20px",
  },
};

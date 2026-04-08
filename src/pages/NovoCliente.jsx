import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import {
  CLIENTE_CLASSIFICACAO,
  CLIENTE_CLASSIFICACAO_OPTIONS,
  CLIENTE_STATUS,
  CLIENTE_STATUS_OPTIONS,
} from "../constants/clientes";
import { criarCliente } from "../services/clientes";

export default function NovoCliente() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    empresa: "",
    email: "",
    telefone: "",
    cidade: "",
    status: CLIENTE_STATUS.PROSPECT,
    classificacao: CLIENTE_CLASSIFICACAO.MORNO,
    proxima_acao: "",
    proxima_visita: "",
  });

  async function handleSubmit(event) {
    event.preventDefault();

    const ok = await criarCliente({
      ...form,
      proxima_acao: form.proxima_acao || null,
      proxima_visita: form.proxima_visita || null,
    });

    if (!ok) {
      return;
    }

    navigate("/clientes");
  }

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <Link to="/clientes" style={styles.backLink}>
          Voltar para clientes
        </Link>
        <h1 style={styles.title}>Novo cliente</h1>
        <p style={styles.subtitle}>
          Cadastre o cliente já com status, classificação e próximo passo para a
          carteira começar organizada.
        </p>
      </section>

      <Card>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.field}>
            <span>Nome</span>
            <input
              type="text"
              value={form.nome}
              onChange={(event) => atualizarCampo("nome", event.target.value)}
              style={styles.input}
              required
            />
          </label>

          <label style={styles.field}>
            <span>Empresa</span>
            <input
              type="text"
              value={form.empresa}
              onChange={(event) => atualizarCampo("empresa", event.target.value)}
              style={styles.input}
            />
          </label>

          <label style={styles.field}>
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => atualizarCampo("email", event.target.value)}
              style={styles.input}
            />
          </label>

          <label style={styles.field}>
            <span>Telefone</span>
            <input
              type="tel"
              value={form.telefone}
              onChange={(event) => atualizarCampo("telefone", event.target.value)}
              style={styles.input}
            />
          </label>

          <label style={styles.field}>
            <span>Cidade</span>
            <input
              type="text"
              value={form.cidade}
              onChange={(event) => atualizarCampo("cidade", event.target.value)}
              style={styles.input}
            />
          </label>

          <label style={styles.field}>
            <span>Status</span>
            <select
              value={form.status}
              onChange={(event) => atualizarCampo("status", event.target.value)}
              style={styles.input}
            >
              {CLIENTE_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.field}>
            <span>Classificação</span>
            <select
              value={form.classificacao}
              onChange={(event) =>
                atualizarCampo("classificacao", event.target.value)
              }
              style={styles.input}
            >
              {CLIENTE_CLASSIFICACAO_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.field}>
            <span>Próxima ação</span>
            <input
              type="text"
              value={form.proxima_acao}
              onChange={(event) =>
                atualizarCampo("proxima_acao", event.target.value)
              }
              style={styles.input}
              placeholder="Ex.: ligar para apresentar a proposta"
            />
          </label>

          <label style={styles.field}>
            <span>Próxima visita</span>
            <input
              type="date"
              value={form.proxima_visita}
              onChange={(event) =>
                atualizarCampo("proxima_visita", event.target.value)
              }
              style={styles.input}
            />
          </label>

          <div style={styles.actions}>
            <Button type="submit">Salvar cliente</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  hero: {
    padding: 24,
    borderRadius: 20,
    border: "1px solid rgba(37,99,235,0.16)",
    background:
      "linear-gradient(135deg, rgba(37,99,235,0.10), rgba(16,185,129,0.08))",
  },
  backLink: {
    display: "inline-flex",
    marginBottom: 12,
    textDecoration: "none",
    fontWeight: 700,
  },
  title: {
    margin: "0 0 8px",
  },
  subtitle: {
    margin: 0,
    color: "#475569",
    lineHeight: 1.6,
    maxWidth: 760,
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 14,
  },
  field: {
    display: "grid",
    gap: 8,
    color: "#334155",
    fontWeight: 600,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    background: "#fff",
  },
  actions: {
    gridColumn: "1 / -1",
    display: "flex",
    justifyContent: "flex-start",
    marginTop: 6,
  },
};

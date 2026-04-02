import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CLIENTE_CLASSIFICACAO,
  CLIENTE_CLASSIFICACAO_OPTIONS,
  CLIENTE_STATUS,
  CLIENTE_STATUS_OPTIONS,
} from "../constants/clientes";
import { criarCliente } from "../services/clientes";

export default function NovoCliente() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cidade, setCidade] = useState("");
  const [status, setStatus] = useState(CLIENTE_STATUS.PROSPECT);
  const [classificacao, setClassificacao] = useState(CLIENTE_CLASSIFICACAO.MORNO);
  const [proximaAcao, setProximaAcao] = useState("");
  const [proximaVisita, setProximaVisita] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const ok = await criarCliente({
      nome,
      empresa,
      telefone,
      email,
      cidade,
      status,
      classificacao,
      proxima_acao: proximaAcao,
      proxima_visita: proximaVisita || null,
    });

    if (ok) {
      navigate("/clientes");
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Novo cliente</h1>
        <p style={styles.subtitle}>
          Cadastre o cliente com contexto comercial suficiente para facilitar o
          próximo contato.
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

          <div style={styles.row}>
            <div style={styles.field}>
              <label>Classificação</label>
              <select
                style={styles.input}
                value={classificacao}
                onChange={(e) => setClassificacao(e.target.value)}
              >
                {CLIENTE_CLASSIFICACAO_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label>Resumo comercial</label>
              <div style={styles.helperBox}>
                Defina o status da negociação e a temperatura do relacionamento
                para priorizar melhor sua carteira.
              </div>
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label>Próxima ação</label>
              <input
                style={styles.input}
                value={proximaAcao}
                onChange={(e) => setProximaAcao(e.target.value)}
                placeholder="Ex.: enviar proposta ou ligar novamente"
              />
            </div>

            <div style={styles.field}>
              <label>Próxima visita</label>
              <input
                type="date"
                style={styles.input}
                value={proximaVisita}
                onChange={(e) => setProximaVisita(e.target.value)}
              />
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
    marginBottom: "25px",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.6,
    maxWidth: "62ch",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "14px",
  },
  input: {
    padding: "11px 12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
  },
  helperBox: {
    minHeight: "48px",
    padding: "10px 12px",
    borderRadius: "10px",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontSize: "13px",
    border: "1px solid #bfdbfe",
    lineHeight: 1.5,
  },
  actions: {
    marginTop: "10px",
  },
  button: {
    width: "100%",
    padding: "13px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

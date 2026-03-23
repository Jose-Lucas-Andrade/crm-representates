import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Bloqueado() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    buscarPerfil();
  }, []);

  async function buscarPerfil() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .single();

    if (data) setProfile(data);
  }

  const dataVencimento =
    profile?.plano === "trial"
      ? profile?.trial_fim
      : profile?.proxima_cobranca;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        <h1 style={styles.title}>🚫 Acesso pausado</h1>

        <p style={styles.subtitle}>
          Seu plano expirou em{" "}
          <strong>
            {dataVencimento
              ? new Date(dataVencimento).toLocaleDateString()
              : "--"}
          </strong>
        </p>

        <div style={styles.alert}>
          ⚠️ Seu CRM foi pausado, mas seus dados estão seguros.
        </div>

        <hr style={{ margin: "20px 0" }} />

        <h2 style={styles.sectionTitle}>Continue usando o sistema</h2>

        <p style={styles.text}>
          Volte a organizar seus clientes, tarefas e follow-ups sem perder vendas.
        </p>

        <div style={styles.pixBox}>
          <p><strong>💳 Pagamento via PIX</strong></p>

          <p><strong>Valor:</strong> R$29,90 / mês</p>

          <p><strong>Chave PIX:</strong></p>
          <p style={styles.pixKey}>61.273.860/0001-93</p>
        </div>

        <p style={styles.textSmall}>
          Após o pagamento, envie o comprovante para liberação imediata.
        </p>

        <a
          href="https://wa.me/5521983631683?text=Olá,%20acabei%20de%20fazer%20o%20pagamento%20do%20CRM%20e%20quero%20liberar%20meu%20acesso"
          target="_blank"
          rel="noreferrer"
          style={styles.button}
        >
          📲 Enviar comprovante e liberar acesso
        </a>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f1f5f9",
  },

  card: {
    background: "#fff",
    padding: "35px",
    borderRadius: "14px",
    width: "380px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },

  title: {
    marginBottom: "10px",
  },

  subtitle: {
    color: "#64748b",
    fontSize: "14px",
  },

  alert: {
    marginTop: "15px",
    padding: "10px",
    background: "#fee2e2",
    borderRadius: "8px",
    color: "#991b1b",
    fontSize: "14px",
  },

  sectionTitle: {
    marginBottom: "10px",
  },

  text: {
    fontSize: "14px",
    color: "#475569",
  },

  textSmall: {
    fontSize: "13px",
    color: "#64748b",
    marginTop: "10px",
  },

  pixBox: {
    background: "#f8fafc",
    padding: "15px",
    borderRadius: "10px",
    marginTop: "15px",
    border: "1px solid #e2e8f0",
  },

  pixKey: {
    fontWeight: "bold",
    fontSize: "15px",
  },

  button: {
    display: "block",
    marginTop: "20px",
    padding: "12px",
    background: "#16a34a",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "bold",
  },
};
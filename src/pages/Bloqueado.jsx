import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Bloqueado() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function buscarPerfil() {
      const { data } = await supabase.from("profiles").select("*").single();

      if (ativo && data) {
        setProfile(data);
      }
    }

    buscarPerfil();

    return () => {
      ativo = false;
    };
  }, []);

  const dataVencimento =
    profile?.plano === "trial" ? profile?.trial_fim : profile?.proxima_cobranca;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.badge}>Acesso pausado</div>
        <h1 style={styles.title}>Seu acesso precisa de renovação</h1>

        <p style={styles.subtitle}>
          {dataVencimento
            ? `Seu período atual venceu em ${new Date(dataVencimento).toLocaleDateString("pt-BR")}.`
            : "Não encontramos uma data de renovação ativa para esta conta."}
        </p>

        <div style={styles.alert}>
          Seus dados continuam seguros. Assim que o plano for regularizado, o
          acesso volta normalmente.
        </div>

        <div style={styles.pixBox}>
          <p style={styles.pixTitle}>Pagamento via PIX</p>
          <p>
            <strong>Valor:</strong> R$ 29,90 / mês
          </p>
          <p>
            <strong>Chave:</strong>
          </p>
          <p style={styles.pixKey}>61.273.860/0001-93</p>
        </div>

        <p style={styles.textSmall}>
          Após o pagamento, envie o comprovante para liberar sua conta com mais
          rapidez.
        </p>

        <a
          href="https://wa.me/5521983631683?text=Ola,%20acabei%20de%20fazer%20o%20pagamento%20do%20CRM%20e%20quero%20liberar%20meu%20acesso"
          target="_blank"
          rel="noreferrer"
          style={styles.button}
        >
          Enviar comprovante
        </a>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    background:
      "radial-gradient(circle at top, rgba(239,68,68,0.10), transparent 30%), #f8fafc",
  },
  card: {
    background: "#fff",
    padding: "36px",
    borderRadius: "18px",
    width: "100%",
    maxWidth: "460px",
    textAlign: "center",
    boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
  },
  badge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "999px",
    background: "#fee2e2",
    color: "#b91c1c",
    fontSize: "12px",
    fontWeight: "bold",
    marginBottom: "16px",
  },
  title: {
    marginBottom: "10px",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.5,
  },
  alert: {
    marginTop: "18px",
    padding: "12px",
    background: "#fff7ed",
    borderRadius: "10px",
    color: "#9a3412",
    fontSize: "14px",
    border: "1px solid #fed7aa",
    lineHeight: 1.5,
  },
  pixBox: {
    background: "#f8fafc",
    padding: "16px",
    borderRadius: "12px",
    marginTop: "20px",
    border: "1px solid #e2e8f0",
  },
  pixTitle: {
    marginTop: 0,
    fontWeight: "bold",
    color: "#0f172a",
  },
  pixKey: {
    fontWeight: "bold",
    fontSize: "16px",
    letterSpacing: "0.04em",
  },
  textSmall: {
    fontSize: "13px",
    color: "#64748b",
    marginTop: "14px",
    lineHeight: 1.5,
  },
  button: {
    display: "block",
    marginTop: "22px",
    padding: "14px",
    background: "#16a34a",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "10px",
    fontWeight: "bold",
  },
};

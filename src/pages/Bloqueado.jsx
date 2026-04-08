import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

const PLANO_MENSAL = "29,90";
const PIX_CHAVE = "61.273.860/0001-93";
const WHATSAPP_LINK =
  "https://wa.me/5521983631683?text=Ola,%20acabei%20de%20fazer%20o%20pagamento%20do%20CRM%20e%20quero%20liberar%20meu%20acesso";

function formatarData(data) {
  if (!data) {
    return null;
  }

  return new Date(data).toLocaleDateString("pt-BR");
}

export default function Bloqueado() {
  const [profile, setProfile] = useState(null);
  const [pixCopiado, setPixCopiado] = useState(false);

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

  async function copiarPix() {
    try {
      await navigator.clipboard.writeText(PIX_CHAVE);
      setPixCopiado(true);

      window.setTimeout(() => {
        setPixCopiado(false);
      }, 2000);
    } catch (error) {
      console.error("Erro ao copiar chave PIX:", error);
    }
  }

  const dataVencimento =
    profile?.plano === "trial" ? profile?.trial_fim : profile?.proxima_cobranca;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.badge}>Acesso pausado</div>
        <h1 style={styles.title}>Sua conta precisa de regularização</h1>

        <p style={styles.subtitle}>
          {dataVencimento
            ? `Seu período atual venceu em ${formatarData(dataVencimento)}.`
            : "Não encontramos uma data de renovação ativa para esta conta."}
        </p>

        <div style={styles.alert}>
          Seus dados continuam seguros. Assim que o plano for regularizado, o
          acesso volta normalmente e você retoma sua carteira sem perder nada.
        </div>

        <div style={styles.planBox}>
          <div>
            <p style={styles.planLabel}>Plano atual para reativação</p>
            <p style={styles.planValue}>R$ {PLANO_MENSAL} / mês</p>
          </div>
          <p style={styles.planText}>
            Ideal para representantes que precisam acompanhar clientes,
            tarefas, oportunidades e follow-ups sem perder tempo.
          </p>
        </div>

        <div style={styles.pixBox}>
          <p style={styles.pixTitle}>Pagamento via PIX</p>
          <p style={styles.pixText}>
            Faça o pagamento e envie o comprovante para liberar sua conta com
            mais rapidez.
          </p>

          <div style={styles.pixKeyBox}>
            <span style={styles.pixKey}>{PIX_CHAVE}</span>
            <button type="button" onClick={copiarPix} style={styles.copyButton}>
              {pixCopiado ? "Copiado" : "Copiar chave"}
            </button>
          </div>
        </div>

        <div style={styles.steps}>
          <div style={styles.stepItem}>
            <strong>1.</strong>
            <span>Faça o pagamento do plano.</span>
          </div>
          <div style={styles.stepItem}>
            <strong>2.</strong>
            <span>Envie o comprovante pelo WhatsApp.</span>
          </div>
          <div style={styles.stepItem}>
            <strong>3.</strong>
            <span>Seu acesso será liberado e a carteira volta normalmente.</span>
          </div>
        </div>

        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noreferrer"
          style={styles.primaryButton}
        >
          Enviar comprovante
        </a>

        <Link to="/login" style={styles.secondaryButton}>
          Voltar para o login
        </Link>
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
    maxWidth: "520px",
    textAlign: "center",
    boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
    border: "1px solid #e2e8f0",
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
    margin: "0 0 10px",
  },
  subtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.6,
  },
  alert: {
    marginTop: "18px",
    padding: "12px",
    background: "#fff7ed",
    borderRadius: "10px",
    color: "#9a3412",
    fontSize: "14px",
    border: "1px solid #fed7aa",
    lineHeight: 1.6,
  },
  planBox: {
    marginTop: "18px",
    padding: "16px",
    borderRadius: "12px",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    textAlign: "left",
  },
  planLabel: {
    margin: 0,
    color: "#1d4ed8",
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  planValue: {
    margin: "8px 0 10px",
    color: "#0f172a",
    fontSize: "28px",
    fontWeight: "bold",
  },
  planText: {
    margin: 0,
    color: "#334155",
    lineHeight: 1.6,
    fontSize: "14px",
  },
  pixBox: {
    background: "#f8fafc",
    padding: "16px",
    borderRadius: "12px",
    marginTop: "20px",
    border: "1px solid #e2e8f0",
    textAlign: "left",
  },
  pixTitle: {
    margin: "0 0 8px",
    fontWeight: "bold",
    color: "#0f172a",
  },
  pixText: {
    margin: "0 0 12px",
    color: "#475569",
    lineHeight: 1.6,
    fontSize: "14px",
  },
  pixKeyBox: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    padding: "12px",
    borderRadius: "10px",
    background: "#fff",
    border: "1px solid #cbd5e1",
  },
  pixKey: {
    fontWeight: "bold",
    fontSize: "16px",
    letterSpacing: "0.04em",
    color: "#0f172a",
  },
  copyButton: {
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    background: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    color: "#0f172a",
  },
  steps: {
    display: "grid",
    gap: 10,
    marginTop: "18px",
    textAlign: "left",
  },
  stepItem: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
    color: "#334155",
    lineHeight: 1.6,
    fontSize: "14px",
  },
  primaryButton: {
    display: "block",
    marginTop: "22px",
    padding: "14px",
    background: "#16a34a",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "10px",
    fontWeight: "bold",
  },
  secondaryButton: {
    display: "block",
    marginTop: "12px",
    padding: "14px",
    background: "#e2e8f0",
    color: "#0f172a",
    textDecoration: "none",
    borderRadius: "10px",
    fontWeight: "bold",
  },
};

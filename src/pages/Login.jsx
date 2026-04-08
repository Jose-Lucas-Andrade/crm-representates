import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensagem, setMensagem] = useState(() => location.state?.mensagem ?? "");
  const [loading, setLoading] = useState(false);
  const [mostrarAvisoPrimeiroAcesso, setMostrarAvisoPrimeiroAcesso] =
    useState(true);

  useEffect(() => {
    if (location.state?.mensagem) {
      navigate(location.pathname, { replace: true });
    }
  }, [location.pathname, location.state, navigate]);

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setMensagem("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        setMensagem("Primeiro acesso: confirme o email cadastrado antes de entrar.");
      } else if (error.message.includes("Invalid login credentials")) {
        setMensagem("Email ou senha inválidos.");
      } else {
        setMensagem("Erro ao fazer login. Tente novamente.");
      }

      setLoading(false);
      return;
    }

    navigate("/");
  }

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={{ marginBottom: 12 }}>Login</h1>
        <p style={subtitle}>Entre para acessar seus clientes, tarefas e follow-ups.</p>

        {mostrarAvisoPrimeiroAcesso ? (
          <div style={noticeBox}>
            <strong>Primeiro acesso?</strong>
            <p style={noticeText}>
              Antes de entrar pela primeira vez, valide o email cadastrado no
              link enviado para a sua caixa de entrada.
            </p>
            <button
              type="button"
              onClick={() => setMostrarAvisoPrimeiroAcesso(false)}
              style={noticeClose}
            >
              Entendi
            </button>
          </div>
        ) : null}

        <form onSubmit={handleLogin} style={form}>
          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            style={input}
          />

          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            style={input}
          />

          <button type="submit" disabled={loading} style={button}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {mensagem && <p style={message}>{mensagem}</p>}

        <p style={{ marginTop: 20 }}>
          Não tem conta?{" "}
          <Link to="/register" style={{ color: "#2563eb", fontWeight: "bold" }}>
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}

const container = {
  minHeight: "100vh",
  padding: 24,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f8fafc",
};

const card = {
  width: "100%",
  maxWidth: 420,
  background: "#fff",
  padding: 32,
  borderRadius: 16,
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
  textAlign: "center",
};

const subtitle = {
  marginBottom: 24,
  color: "#64748b",
  fontSize: 14,
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: 15,
};

const input = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
};

const button = {
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};

const message = {
  marginTop: 18,
  color: "#0f172a",
  fontSize: 14,
};

const noticeBox = {
  marginBottom: 20,
  padding: "14px",
  borderRadius: 12,
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  textAlign: "left",
};

const noticeText = {
  margin: "8px 0 12px",
  color: "#334155",
  fontSize: 14,
  lineHeight: 1.6,
};

const noticeClose = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #cbd5e1",
  background: "#fff",
  color: "#0f172a",
  cursor: "pointer",
  fontWeight: "bold",
};

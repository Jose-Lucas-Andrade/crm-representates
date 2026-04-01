import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Register() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setMensagem("");

    if (password.length < 6) {
      setMensagem("A senha deve ter pelo menos 6 caracteres.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome,
        },
      },
    });

    if (error) {
      setMensagem(error.message);
    } else {
      navigate("/login", {
        replace: true,
        state: {
          mensagem: "Conta criada com sucesso. Verifique o email cadastrado para validar a conta antes do primeiro login.",
        },
      });
      return;
    }

    setLoading(false);
  }

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={{ marginBottom: 12 }}>Criar conta</h1>
        <p style={subtitle}>Comece com um periodo de teste e organize seu pipeline comercial.</p>

        <form onSubmit={handleRegister} style={form}>
          <input
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={input}
          />

          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={input}
          />

          <input
            type="password"
            placeholder="Crie uma senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={input}
          />

          <button type="submit" disabled={loading} style={button}>
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        {mensagem && <p style={message}>{mensagem}</p>}

        <p style={{ marginTop: 20 }}>
          Ja tem conta?{" "}
          <Link to="/login" style={{ color: "#2563eb", fontWeight: "bold" }}>
            Entrar
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
  background: "#16a34a",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};

const message = {
  marginTop: 18,
  color: "#0f172a",
  fontSize: 14,
};

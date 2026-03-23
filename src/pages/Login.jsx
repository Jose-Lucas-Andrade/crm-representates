import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);
    setMensagem("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        setMensagem("Email ou senha inválidos.");
      } else {
        setMensagem("Erro ao fazer login. Tente novamente.");
      }
    } else {
      setMensagem("Login realizado com sucesso!");
      // Redirecionamento simples
      window.location.href = "/";
    }

    setLoading(false);
  }

  return (
    <div style={container}>

      <h1 style={{ marginBottom: 20 }}>
        Login
      </h1>

      <form onSubmit={handleLogin} style={form}>

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
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={input}
        />

        <button
          type="submit"
          disabled={loading}
          style={button}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

      </form>

      {mensagem && (
        <p style={{ marginTop: 20 }}>
          {mensagem}
        </p>
      )}

      <p style={{ marginTop: 20 }}>
        Não tem conta?{" "}
        <a href="/register" style={{ color: "#2563eb" }}>
          Criar conta
        </a>
      </p>

    </div>
  );
}

const container = {
  padding: 40,
  maxWidth: 400,
  margin: "0 auto",
  textAlign: "center"
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: 15
};

const input = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #cbd5e1"
};

const button = {
  padding: "10px",
  borderRadius: "6px",
  border: "none",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer"
};
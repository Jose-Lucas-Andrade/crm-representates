import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Register() {

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
      setMensagem("Conta criada com sucesso! Faça login.");

      setNome("");
      setEmail("");
      setPassword("");
    }

    setLoading(false);
  }

  return (
    <div style={container}>

      <h1 style={{ marginBottom: 10 }}>
        Criar conta
      </h1>

      <p style={{ marginBottom: 20, color: "#64748b" }}>
        Comece grátis por 7 dias 🚀
      </p>

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

        <button
          type="submit"
          disabled={loading}
          style={button}
        >
          {loading ? "Criando conta..." : "Criar conta"}
        </button>

      </form>

      {mensagem && (
        <p style={{ marginTop: 20 }}>
          {mensagem}
        </p>
      )}

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
  background: "#16a34a",
  color: "#fff",
  cursor: "pointer"
};

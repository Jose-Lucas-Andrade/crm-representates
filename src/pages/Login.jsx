import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMensagem("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "http://localhost:5173/clientes"
      }
    });

    if (error) {
      setMensagem("Erro ao enviar email.");
    } else {
      setMensagem("Verifique seu email para acessar.");
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: "0 auto" }}>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Entrar"}
        </button>
      </form>

      {mensagem && <p style={{ marginTop: 20 }}>{mensagem}</p>}
    </div>
  );
}

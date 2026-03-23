import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const [ativo, setAtivo] = useState(null);

  useEffect(() => {
    if (user) {
      verificarAcesso();
    } else {
      setAtivo(false); // 🔥 evita travamento
    }
  }, [user]);

  async function verificarAcesso() {
    try {
      const { data, error } = await supabase.rpc("usuario_ativo");

      if (error) {
        console.error("Erro ao verificar acesso:", error);
        setAtivo(false);
      } else {
        setAtivo(data);
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
      setAtivo(false);
    }
  }

  // 🔄 Aguarda apenas autenticação OU verificação se tiver usuário
  if (loading || (user && ativo === null)) {
    return <div>Carregando...</div>;
  }

  // 🔒 Não logado → login direto
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 🚫 Sem acesso → bloqueado
  if (!ativo) {
    return <Navigate to="/bloqueado" />;
  }

  // ✅ Liberado
  return children;
}
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
    }
  }, [user]);

  async function verificarAcesso() {
    const { data, error } = await supabase.rpc("usuario_ativo");

    if (error) {
      console.error("Erro ao verificar acesso:", error);
      setAtivo(false);
    } else {
      setAtivo(data);
    }
  }

  // carregando auth OU verificação
  if (loading || ativo === null) {
    return <div>Carregando...</div>;
  }

  // não logado
  if (!user) {
    return <Navigate to="/login" />;
  }

  // logado mas sem acesso
  if (!ativo) {
    return <Navigate to="/bloqueado" />;
  }

  // liberado
  return children;
}
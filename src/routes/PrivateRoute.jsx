import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { supabase } from "../supabaseClient";

function isProfileExpirado(profile) {
  if (!profile) {
    return true;
  }

  const agora = new Date();

  if (profile.plano === "pro") {
    return (
      Boolean(profile.proxima_cobranca) &&
      new Date(profile.proxima_cobranca) < agora
    );
  }

  if (profile.plano === "trial" || profile.plano === "basic") {
    return Boolean(profile.trial_fim) && new Date(profile.trial_fim) < agora;
  }

  return false;
}

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const [resultadoAcesso, setResultadoAcesso] = useState({
    userId: null,
    status: "checking",
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    let mounted = true;

    async function verificarAcesso() {
      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("id, plano, trial_fim, proxima_cobranca")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Erro ao buscar profile:", error);
          if (mounted) {
            setResultadoAcesso({ userId: user.id, status: "blocked" });
          }
          return;
        }

        if (!profile) {
          if (mounted) {
            setResultadoAcesso({ userId: user.id, status: "blocked" });
          }
          return;
        }

        if (mounted) {
          setResultadoAcesso({
            userId: user.id,
            status: isProfileExpirado(profile) ? "blocked" : "allowed",
          });
        }
      } catch (error) {
        console.error("Erro inesperado ao validar acesso:", error);
        if (mounted) {
          setResultadoAcesso({ userId: user.id, status: "blocked" });
        }
      }
    }

    verificarAcesso();

    return () => {
      mounted = false;
    };
  }, [user]);

  const checking =
    Boolean(user) &&
    (resultadoAcesso.userId !== user.id || resultadoAcesso.status === "checking");

  if (loading || checking) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (resultadoAcesso.status === "blocked") {
    return <Navigate to="/bloqueado" replace />;
  }

  return children;
}

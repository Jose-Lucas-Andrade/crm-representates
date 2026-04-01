import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { supabase } from "../supabaseClient";

function isProfileExpirado(profile) {
  if (!profile) {
    return false;
  }

  const agora = new Date();

  if (profile.plano === "pro") {
    return (
      Boolean(profile.proxima_cobranca) &&
      new Date(profile.proxima_cobranca) < agora
    );
  }

  if (profile.plano === "trial" || profile.plano === "basic") {
    return (
      Boolean(profile.trial_fim) &&
      new Date(profile.trial_fim) < agora
    );
  }

  return false;
}

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const [bloqueado, setBloqueado] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user) {
      setBloqueado(false);
      setChecking(false);
      return;
    }

    let mounted = true;

    async function verificarAcesso() {
      setChecking(true);

      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("id, plano, trial_fim, proxima_cobranca")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Erro ao buscar profile:", error);
          if (mounted) {
            setBloqueado(false);
          }
          return;
        }

        if (mounted) {
          setBloqueado(isProfileExpirado(profile));
        }
      } catch (error) {
        console.error("Erro inesperado ao validar acesso:", error);
        if (mounted) {
          setBloqueado(false);
        }
      } finally {
        if (mounted) {
          setChecking(false);
        }
      }
    }

    verificarAcesso();

    return () => {
      mounted = false;
    };
  }, [user]);

  if (loading || checking) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (bloqueado) {
    return <Navigate to="/bloqueado" />;
  }

  return children;
}

import { supabase } from "../supabaseClient";

export async function listarClientesSemContato() {
  const { data, error } = await supabase.rpc("clientes_sem_contato", {
    dias_limite: 15,
  });

  if (error) {
    console.error("Erro ao buscar alertas:", error.message);
    return [];
  }

  return data;
}

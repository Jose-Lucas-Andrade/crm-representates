import { supabase } from "../supabaseClient";

export async function listarClientesSemContato(dias = 7) {
  const { data, error } = await supabase
    .rpc("clientes_sem_contato", { dias_limite: dias });

  if (error) {
    console.error("Erro ao buscar follow-up:", error.message);
    return [];
  }

  return data || [];
}
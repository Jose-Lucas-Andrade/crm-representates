import { supabase } from "../supabaseClient";

export async function listarClientesSemContato() {
  const { data, error } = await supabase.rpc("dias_sem_contato");

  if (error) {
    console.error("Erro ao buscar alertas:", error.message);
    return [];
  }

  return data;
}
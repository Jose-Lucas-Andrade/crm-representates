import { supabase } from "../supabaseClient";

export async function listarClientesPorStatus() {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar oportunidades:", error.message);
    return [];
  }

  return data;
}

export async function atualizarStatus(cliente_id, status) {
  const { error } = await supabase
    .from("clientes")
    .update({ status })
    .eq("id", cliente_id);

  if (error) {
    console.error("Erro ao atualizar status:", error.message);
    alert("Erro ao atualizar status");
    return false;
  }

  return true;
}
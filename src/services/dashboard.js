import { supabase } from "../supabaseClient";

export async function obterResumo() {
  const { data, error } = await supabase.rpc("dashboard_resumo");

  if (error) {
    console.error("Erro ao carregar dashboard:", error.message);
    return null;
  }

  return data[0];
}

export async function contatosHoje() {
  const { data, error } = await supabase.rpc("contatos_hoje");

  if (error) {
    console.error("Erro ao buscar contatos de hoje:", error.message);
    return 0;
  }

  return data;
}

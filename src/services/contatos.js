import { supabase } from "../supabaseClient";

// ===============================
// LISTAR CONTATOS DE UM CLIENTE
// ===============================
export async function listarContatos(cliente_id) {
  const { data, error } = await supabase
    .from("contatos")
    .select("*")
    .eq("cliente_id", cliente_id)
    .order("data_contato", { ascending: false });

  if (error) {
    console.error("Erro ao buscar contatos:", error.message);
    return [];
  }

  return data;
}

// ===============================
// CRIAR CONTATO
// ===============================
export async function criarContato(dados) {
  const { error } = await supabase.from("contatos").insert([
    {
      cliente_id: dados.cliente_id,
      data_contato: dados.data_contato,
      observacao: dados.observacao || "Contato rápido",
    },
  ]);

  if (error) {
    console.error("Erro ao registrar contato:", error.message);
    alert("Erro ao registrar contato: " + error.message);
    return false;
  }

  return true;
}

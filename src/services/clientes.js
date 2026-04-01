import { supabase } from "../supabaseClient";
import {
  CLIENTE_CLASSIFICACAO,
  CLIENTE_STATUS,
} from "../constants/clientes";

export async function listarClientes() {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao listar clientes:", error.message);
    return [];
  }

  return data;
}

export async function criarCliente(cliente) {
  // Pega usuário logado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Usuário não autenticado");
    return false;
  }

  const { error } = await supabase.from("clientes").insert([
    {
      user_id: user.id,   // 🔥 ESSENCIAL para passar na RLS
      nome: cliente.nome,
      empresa: cliente.empresa,
      telefone: cliente.telefone,
      email: cliente.email,
      cidade: cliente.cidade,
      status: cliente.status || CLIENTE_STATUS.PROSPECT,
      classificacao:
        cliente.classificacao || CLIENTE_CLASSIFICACAO.MORNO,
    },
  ]);

  if (error) {
    console.error("Erro ao criar cliente:", error.message);
    alert("Erro ao criar cliente: " + error.message);
    return false;
  }

  return true;
}

export async function atualizarCliente(id, cliente) {
  const payload = {
    ...cliente,
    classificacao:
      cliente.classificacao || CLIENTE_CLASSIFICACAO.MORNO,
  };

  const { error } = await supabase
    .from("clientes")
    .update(payload)
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar cliente:", error.message);
    alert("Erro ao atualizar: " + error.message);
    return false;
  }

  return true;
}

export async function excluirCliente(id) {
  const { error } = await supabase
    .from("clientes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao excluir cliente:", error.message);
    alert("Erro ao excluir: " + error.message);
    return false;
  }

  return true;
}

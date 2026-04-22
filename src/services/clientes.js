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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Usuario nao autenticado");
    return false;
  }

  const { error } = await supabase.from("clientes").insert([
    {
      user_id: user.id,
      nome: cliente.nome,
      empresa: cliente.empresa,
      telefone: cliente.telefone,
      email: cliente.email,
      cidade: cliente.cidade,
      status: cliente.status || CLIENTE_STATUS.PROSPECT,
      classificacao: cliente.classificacao || CLIENTE_CLASSIFICACAO.MORNO,
      proxima_acao: cliente.proxima_acao || null,
      proxima_visita: cliente.proxima_visita || null,
    },
  ]);

  if (error) {
    console.error("Erro ao criar cliente:", error.message);
    alert(`Erro ao criar cliente: ${error.message}`);
    return false;
  }

  return true;
}

export async function importarClientesEmLote(clientes) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Usuario nao autenticado." };
  }

  if (!clientes || clientes.length === 0) {
    return { ok: false, error: "Nao ha clientes validos para importar." };
  }

  const payload = clientes.map((cliente) => ({
    user_id: user.id,
    nome: cliente.nome,
    empresa: cliente.empresa || null,
    telefone: cliente.telefone || null,
    email: cliente.email || null,
    cidade: cliente.cidade || null,
    status: cliente.status || CLIENTE_STATUS.PROSPECT,
    classificacao: cliente.classificacao || CLIENTE_CLASSIFICACAO.MORNO,
    proxima_acao: cliente.proxima_acao || null,
    proxima_visita: cliente.proxima_visita || null,
  }));

  const { error } = await supabase.from("clientes").insert(payload);

  if (error) {
    console.error("Erro ao importar clientes:", error.message);
    return { ok: false, error: `Erro ao importar clientes: ${error.message}` };
  }

  return { ok: true, importados: payload.length };
}

export async function atualizarCliente(id, cliente) {
  const payload = {
    ...cliente,
    classificacao: cliente.classificacao || CLIENTE_CLASSIFICACAO.MORNO,
  };

  const { error } = await supabase
    .from("clientes")
    .update(payload)
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar cliente:", error.message);
    alert(`Erro ao atualizar: ${error.message}`);
    return false;
  }

  return true;
}

export async function excluirCliente(id) {
  const { error } = await supabase.from("clientes").delete().eq("id", id);

  if (error) {
    console.error("Erro ao excluir cliente:", error.message);
    alert(`Erro ao excluir: ${error.message}`);
    return false;
  }

  return true;
}

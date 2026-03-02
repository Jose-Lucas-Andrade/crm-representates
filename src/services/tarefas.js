import { supabase } from "../supabaseClient";

/* ===============================
   CRIAR TAREFA
================================ */
export async function criarTarefa(tarefa) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("tarefas").insert([
    {
      user_id: user.id,
      cliente_id: tarefa.cliente_id,
      titulo: tarefa.titulo,
      tipo: tarefa.tipo,
      data: tarefa.data,
    },
  ]);

  if (error) {
    console.error("Erro ao criar tarefa:", error.message);
    return false;
  }

  return true;
}

/* ===============================
   TAREFAS DO DIA (DASHBOARD)
================================ */
export async function listarTarefasDoDia() {
  const { data, error } = await supabase.rpc("tarefas_do_dia");

  if (error) {
    console.error("Erro ao buscar tarefas do dia:", error.message);
    return [];
  }

  return data || [];
}

/* ===============================
   TAREFAS DO CLIENTE
================================ */
export async function listarTarefasDoCliente(cliente_id) {
  const { data, error } = await supabase
    .from("tarefas")
    .select("*")
    .eq("cliente_id", cliente_id)
    .eq("concluida", false)
    .order("data", { ascending: true });

  if (error) {
    console.error("Erro ao listar tarefas do cliente:", error.message);
    return [];
  }

  return data || [];
}

/* ===============================
   CONCLUIR TAREFA
================================ */
export async function concluirTarefa(id) {
  const { error } = await supabase
    .from("tarefas")
    .update({ concluida: true })
    .eq("id", id);

  if (error) {
    console.error("Erro ao concluir tarefa:", error.message);
    return false;
  }

  return true;
}
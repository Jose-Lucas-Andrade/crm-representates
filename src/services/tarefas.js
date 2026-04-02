import { supabase } from "../supabaseClient";

/* ===============================
   CRIAR TAREFA
================================ */
export async function criarTarefa(tarefa) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("Erro ao criar tarefa: usuário não autenticado");
    return { ok: false, error: "Usuário não autenticado." };
  }

  const { error } = await supabase.from("tarefas").insert([
    {
      user_id: user.id,
      cliente_id: tarefa.cliente_id,
      titulo: tarefa.titulo,
      tipo: tarefa.tipo,
      data: tarefa.data,
      prioridade: "MEDIA",
    },
  ]);

  if (error) {
    console.error("Erro ao criar tarefa:", error.message);
    return { ok: false, error: error.message };
  }

  return { ok: true, error: null };
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
   TAREFAS PENDENTES GERAIS
================================ */
export async function listarTarefasPendentes() {
  const [{ data: tarefas, error: tarefasError }, { data: clientes, error: clientesError }] =
    await Promise.all([
      supabase
        .from("tarefas")
        .select("id, titulo, tipo, data, cliente_id, concluida")
        .eq("concluida", false)
        .order("data", { ascending: true }),
      supabase.from("clientes").select("id, nome"),
    ]);

  if (tarefasError) {
    console.error("Erro ao listar tarefas pendentes:", tarefasError.message);
    return [];
  }

  if (clientesError) {
    console.error("Erro ao buscar clientes das tarefas:", clientesError.message);
    return [];
  }

  const clientesMap = new Map((clientes || []).map((cliente) => [cliente.id, cliente.nome]));

  return (tarefas || []).map((tarefa) => ({
    ...tarefa,
    cliente_nome: clientesMap.get(tarefa.cliente_id) || "Cliente não encontrado",
  }));
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

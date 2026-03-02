import { useEffect, useState } from "react";
import { listarTarefasDoDia, concluirTarefa } from "../services/tarefas";

export default function Tarefas() {
  const [tarefas, setTarefas] = useState([]);

  async function carregar() {
    const data = await listarTarefasDoDia();
    setTarefas(data);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function concluir(id) {
    await concluirTarefa(id);
    carregar();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>📅 Tarefas de Hoje</h1>

      {tarefas.length === 0 ? (
        <p>Nenhuma tarefa para hoje 🎉</p>
      ) : (
        tarefas.map((t) => (
          <div
            key={t.id}
            style={{
              border: "1px solid #ddd",
              padding: 12,
              marginBottom: 10,
              borderRadius: 6,
              background: "#fff",
            }}
          >
            <b>{t.titulo}</b> ({t.tipo})  
            <br />
            Cliente: <b>{t.cliente_nome}</b>
            <br />
            <button onClick={() => concluir(t.id)}>
              Concluir
            </button>
          </div>
        ))
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import { concluirTarefa, listarTarefasDoDia } from "../services/tarefas";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function Tarefas() {
  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const data = await listarTarefasDoDia();
      if (ativo) {
        setTarefas(data);
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, []);

  async function concluir(id) {
    await concluirTarefa(id);
    const data = await listarTarefasDoDia();
    setTarefas(data);
  }

  return (
    <>
      <h1 style={{ marginBottom: 25 }}>Tarefas de hoje</h1>

      {tarefas.length === 0 ? (
        <Card>
          <p>Nenhuma tarefa para hoje.</p>
        </Card>
      ) : (
        tarefas.map((tarefa) => (
          <Card key={tarefa.id}>
            <div style={{ marginBottom: 10 }}>
              <b>{tarefa.titulo}</b> ({tarefa.tipo})
            </div>

            <div style={{ marginBottom: 15 }}>
              Cliente: <b>{tarefa.cliente_nome}</b>
            </div>

            <Button onClick={() => concluir(tarefa.id)}>Concluir</Button>
          </Card>
        ))
      )}
    </>
  );
}

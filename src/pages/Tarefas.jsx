import { useEffect, useState } from "react";

import {
  listarTarefasDoDia,
  concluirTarefa,
} from "../services/tarefas";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

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
    <>
      <h1 style={{ marginBottom: 25 }}>📅 Tarefas de Hoje</h1>

      {tarefas.length === 0 ? (
        <Card>
          <p>Nenhuma tarefa para hoje 🎉</p>
        </Card>
      ) : (
        tarefas.map((t) => (
          <Card key={t.id}>
            <div style={{ marginBottom: 10 }}>
              <b>{t.titulo}</b> ({t.tipo})
            </div>

            <div style={{ marginBottom: 15 }}>
              Cliente: <b>{t.cliente_nome}</b>
            </div>

            <Button onClick={() => concluir(t.id)}>
              Concluir
            </Button>
          </Card>
        ))
      )}
    </>
  );
}
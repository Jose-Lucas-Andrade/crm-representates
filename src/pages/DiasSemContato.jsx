import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function DiasSemContato() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    supabase
      .rpc("dias_sem_contato")
      .then(({ data }) => setDados(data));
  }, []);

  return (
    <div>
      <h1>Dias sem contato</h1>

      <ul>
        {dados?.map((c) => (
          <li key={c.id}>
            {c.nome} — {c.dias_sem_contato ?? "Sem contato"}
          </li>
        ))}
      </ul>
    </div>
  );
}

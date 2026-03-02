import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { listarClientes, atualizarCliente } from "../services/clientes";

export default function EditarCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    async function carregar() {
      const lista = await listarClientes();
      const cliente = lista.find(c => c.id === id);
      setForm(cliente);
    }
    carregar();
  }, [id]);

  async function salvar(e) {
    e.preventDefault();
    await atualizarCliente(id, form);
    navigate("/clientes/editar/" + cliente.id);
  }

  if (!form) return <p style={{ padding: 20 }}>Carregando...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Editar Cliente</h2>
      <form onSubmit={salvar}>
        <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
        <input value={form.empresa} onChange={e => setForm({ ...form, empresa: e.target.value })} />
        <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}

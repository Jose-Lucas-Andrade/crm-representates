import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { criarCliente } from "../services/clientes";

export default function NovoCliente() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    empresa: "",
    telefone: "",
    email: "",
    cidade: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const criado = await criarCliente(form);

    if (criado) {
      navigate("/clientes");
    } else {
      alert("Erro ao salvar cliente");
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Novo Cliente</h1>

      <form onSubmit={handleSubmit}>
        <input name="nome" placeholder="Nome" onChange={handleChange} required />
        <input name="empresa" placeholder="Empresa" onChange={handleChange} />
        <input name="telefone" placeholder="Telefone" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="cidade" placeholder="Cidade" onChange={handleChange} />

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}

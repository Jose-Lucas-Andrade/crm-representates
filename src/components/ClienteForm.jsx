// src/components/ClienteForm.jsx
import { useState } from "react";
import { criarCliente } from "../services/clientes";

export default function ClienteForm({ onSuccess }) {
  const [form, setForm] = useState({
    nome: "",
    empresa: "",
    email: "",
    telefone: "",
    cidade: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await criarCliente(form);
      setForm({ nome: "", empresa: "", email: "", telefone: "", cidade: "" });
      onSuccess();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="nome" placeholder="Nome" onChange={handleChange} value={form.nome} required />
      <input name="empresa" placeholder="Empresa" onChange={handleChange} value={form.empresa} />
      <input name="email" placeholder="Email" onChange={handleChange} value={form.email} />
      <input name="telefone" placeholder="Telefone" onChange={handleChange} value={form.telefone} />
      <input name="cidade" placeholder="Cidade" onChange={handleChange} value={form.cidade} />

      <button type="submit">Salvar</button>
    </form>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { criarCliente } from "../services/clientes";

export default function NovoCliente() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cidade, setCidade] = useState("");
  const [status, setStatus] = useState("Prospect");

  async function handleSubmit(e) {
    e.preventDefault();

    const ok = await criarCliente({
      nome,
      empresa,
      telefone,
      email,
      cidade,
      status
    });

    if (ok) {
      navigate("/clientes");
    }
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Novo Cliente</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            placeholder="Empresa"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
          />
        </div>

        <div>
          <input
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>

        <div>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <input
            placeholder="Cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
          />
        </div>

        <div>
          <label>Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Prospect">Prospect</option>
            <option value="Contato">Contato</option>
            <option value="Negociação">Negociação</option>
            <option value="Cliente">Cliente</option>
            <option value="Perdido">Perdido</option>
          </select>
        </div>

        <br />

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}

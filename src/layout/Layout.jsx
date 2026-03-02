import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";


export default function Layout({ children }) {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      
      {/* Sidebar */}
      <aside
        style={{
          width: "220px",
          background: "#1e293b",
          color: "#fff",
          padding: "20px",
        }}
      >
        <h2 style={{ marginBottom: "30px" }}>CRM</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link to="/" style={linkStyle}>Dashboard</Link>
          <Link to="/clientes" style={linkStyle}>Clientes</Link>
          <Link to="/clientes/novo" style={linkStyle}>Novo Cliente</Link>
          <Link to="/alertas" style={linkStyle}>Alertas</Link>
          <Link to="/oportunidades" style={linkStyle}>Oportunidades</Link>
          <Link to="/tarefas" style={linkStyle}>Tarefas</Link>
        </nav>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "40px",
            padding: "10px",
            background: "#ef4444",
            border: "none",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Sair
        </button>
      </aside>

      {/* Conteúdo */}
      <main
        style={{
          flex: 1,
          background: "#f1f5f9",
          padding: "30px",
          overflowY: "auto",
        }}
      >
        {children}
      </main>
    </div>
  );
}

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  padding: "8px",
  background: "#334155",
};

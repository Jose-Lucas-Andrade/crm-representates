import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  const menu = [
    { name: "Dashboard", path: "/" },
    { name: "Clientes", path: "/clientes" },
    { name: "Novo Cliente", path: "/clientes/novo" },
    { name: "Alertas", path: "/alertas" },
    { name: "Oportunidades", path: "/oportunidades" },
    { name: "Tarefas", path: "/tarefas" },
  ];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>ClienteFácil</h2>

        <nav style={styles.nav}>
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.link,
                background:
                  location.pathname === item.path
                    ? "#1e293b"
                    : "transparent",
              }}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <button onClick={handleLogout} style={styles.logout}>
          Sair
        </button>
      </aside>

      {/* Área principal */}
      <div style={styles.mainWrapper}>
        <header style={styles.header}>
          <span style={{ fontWeight: "bold" }}>
            Sistema de Gestão para Representantes
          </span>
        </header>

        {/* AQUI ESTÁ A CORREÇÃO */}
        <main style={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Inter, Arial, sans-serif",
  },
  sidebar: {
    width: "230px",
    background: "#0f172a",
    color: "#fff",
    padding: "25px",
    display: "flex",
    flexDirection: "column",
  },
  logo: {
    marginBottom: "40px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  link: {
    color: "#e2e8f0",
    textDecoration: "none",
    padding: "10px",
    borderRadius: "6px",
    transition: "0.2s",
  },
  logout: {
    marginTop: "auto",
    padding: "10px",
    background: "#dc2626",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
  },
  mainWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "#f8fafc",
  },
  header: {
    height: "60px",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    padding: "0 30px",
    borderBottom: "1px solid #e2e8f0",
  },
  content: {
    flex: 1,
    padding: "30px",
    overflowY: "auto",
  },
};
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Clientes", path: "/clientes" },
    { name: "Pipeline", path: "/pipeline" },
    { name: "Tarefas", path: "/tarefas" },
    { name: "Alertas", path: "/alertas" },
  ];

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>CRM Pro</h2>

      <nav style={styles.nav}>
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.link,
              background:
                location.pathname === item.path
                  ? "#1f2937"
                  : "transparent",
            }}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "230px",
    backgroundColor: "#111827",
    color: "#fff",
    height: "100vh",
    padding: "25px",
    position: "fixed",
    left: 0,
    top: 0,
  },
  logo: {
    marginBottom: "40px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    padding: "10px",
    borderRadius: "6px",
    transition: "0.2s",
  },
};
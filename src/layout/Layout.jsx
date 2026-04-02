import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 960);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 960);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  const menu = [
    { name: "Dashboard", path: "/" },
    { name: "Hoje", path: "/hoje" },
    { name: "Clientes", path: "/clientes" },
    { name: "Novo cliente", path: "/clientes/novo" },
    { name: "Alertas", path: "/alertas" },
    { name: "Oportunidades", path: "/oportunidades" },
    { name: "Tarefas", path: "/tarefas" },
    { name: "Ajuda", path: "/ajuda" },
  ];

  return (
    <div
      style={{
        ...styles.container,
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      <aside
        style={{
          ...styles.sidebar,
          ...(isMobile ? styles.sidebarMobile : {}),
        }}
      >
        <div style={styles.sidebarTop}>
          <div>
            <div style={styles.brandBadge}>CRM</div>
            <h2 style={styles.logo}>Representa</h2>
            <p style={styles.logoText}>
              Operação comercial organizada para representantes de alta cadência.
            </p>
          </div>

          {isMobile ? (
            <button
              type="button"
              onClick={() => setMenuOpen((valorAtual) => !valorAtual)}
              style={styles.menuButton}
            >
              {menuOpen ? "Fechar" : "Menu"}
            </button>
          ) : null}
        </div>

        {(!isMobile || menuOpen) && (
          <>
            <nav
              style={{
                ...styles.nav,
                ...(isMobile ? styles.navMobile : {}),
              }}
            >
              {menu.map((item) => {
                const ativo = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      ...styles.link,
                      ...(ativo ? styles.linkActive : {}),
                    }}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={async () => {
                setMenuOpen(false);
                await handleLogout();
              }}
              style={styles.logout}
            >
              Sair
            </button>
          </>
        )}
      </aside>

      <div style={styles.mainWrapper}>
        <header
          style={{
            ...styles.header,
            ...(isMobile ? styles.headerMobile : {}),
          }}
        >
          <span style={styles.headerText}>
            Gestão comercial para clientes, follow-ups e pós-venda
          </span>
        </header>

        <main
          style={{
            ...styles.content,
            ...(isMobile ? styles.contentMobile : {}),
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Segoe UI, Arial, sans-serif",
    background: "#e2e8f0",
  },
  sidebar: {
    width: "260px",
    background:
      "linear-gradient(180deg, #0f172a 0%, #111827 45%, #172554 100%)",
    color: "#fff",
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  sidebarMobile: {
    width: "100%",
    padding: "20px",
    gap: "18px",
  },
  sidebarTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
  },
  brandBadge: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    background: "rgba(125, 211, 252, 0.14)",
    color: "#bae6fd",
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  logo: {
    margin: "14px 0 8px",
    fontSize: "28px",
  },
  logoText: {
    margin: 0,
    color: "#cbd5e1",
    lineHeight: 1.5,
    fontSize: "14px",
    maxWidth: "28ch",
  },
  menuButton: {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  navMobile: {
    gap: "10px",
  },
  link: {
    color: "#e2e8f0",
    textDecoration: "none",
    padding: "12px 14px",
    borderRadius: "12px",
    transition: "0.2s",
  },
  linkActive: {
    background: "rgba(255,255,255,0.12)",
    color: "#fff",
    fontWeight: "bold",
  },
  logout: {
    marginTop: "auto",
    padding: "12px",
    background: "#dc2626",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  mainWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background:
      "radial-gradient(circle at top left, rgba(37,99,235,0.08), transparent 32%), #f8fafc",
  },
  header: {
    minHeight: "68px",
    background: "rgba(255,255,255,0.9)",
    display: "flex",
    alignItems: "center",
    padding: "0 30px",
    borderBottom: "1px solid #e2e8f0",
    backdropFilter: "blur(8px)",
  },
  headerMobile: {
    minHeight: "auto",
    padding: "16px 20px",
  },
  headerText: {
    fontWeight: "bold",
    color: "#0f172a",
    lineHeight: 1.4,
  },
  content: {
    flex: 1,
    padding: "30px",
    overflowY: "auto",
  },
  contentMobile: {
    padding: "20px 16px 28px",
  },
};

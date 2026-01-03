import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <header style={styles.header}>
        <h2 style={styles.logo}>InventarisApp</h2>

        <nav>
          <Link style={styles.link} to="/">Dashboard</Link>
          <Link style={styles.link} to="/barang">Barang</Link>
          <Link style={styles.link} to="/kategori">Kategori</Link>
          <Link style={styles.link} to="/supplier">Supplier</Link>
        </nav>
      </header>

      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  header: {
    background: "#ffffff",
    padding: "16px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  logo: {
    margin: 0,
    color: "#2563eb",
  },
  link: {
    marginLeft: 20,
    textDecoration: "none",
    fontWeight: "500",
    color: "#2563eb",
  },
  main: {
    padding: 32,
    background: "#f3f4f6",
    minHeight: "100vh",
  },
};

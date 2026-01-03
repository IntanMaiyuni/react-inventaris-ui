import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "16px 24px",
      background: "#111",
      color: "#fff"
    }}>
      <h2>InventarisApp</h2>
      <div style={{ display: "flex", gap: "20px" }}>
        <Link style={{ color: "#fff" }} to="/">Dashboard</Link>
        <Link style={{ color: "#fff" }} to="/items">Items</Link>
        <Link style={{ color: "#fff" }} to="/categories">Kategori</Link>
        <Link style={{ color: "#fff" }} to="/suppliers">Supplier</Link>
      </div>
    </div>
  );
}

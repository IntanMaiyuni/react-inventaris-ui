export default function Card({ title, value }) {
  return (
    <div style={{
      padding: "20px",
      borderRadius: "12px",
      background: "#ffffff",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      textAlign: "center"
    }}>
      <p style={{ color: "#666", marginBottom: "8px" }}>{title}</p>
      <h1 style={{ fontSize: "32px", margin: 0 }}>{value}</h1>
    </div>
  );
}

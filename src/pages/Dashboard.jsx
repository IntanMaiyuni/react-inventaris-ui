import React, { useState, useEffect } from "react";

export default function Dashboard() {
  const [data, setData] = useState({
    items: [],
    categories: [],
    suppliers: [],
    logs: []
  });

  // 1. State untuk mendeteksi lebar layar (Responsive Hook)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const loadAllData = () => {
    const items = JSON.parse(localStorage.getItem("inventaris_items") || "[]");
    const categories = JSON.parse(localStorage.getItem("inventaris_categories") || "[]");
    const suppliers = JSON.parse(localStorage.getItem("inventaris_suppliers") || "[]");
    const logs = JSON.parse(localStorage.getItem("inventaris_logs") || "[]");
    setData({ items, categories, suppliers, logs });
  };

  useEffect(() => {
    loadAllData();
    
    // 2. Listener untuk memantau perubahan ukuran layar
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    window.addEventListener('storage', loadAllData);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('storage', loadAllData);
    };
  }, []);

  const itemsStokRendah = data.items.filter(it => Number(it.stok) < 10);
  const totalStokRendah = itemsStokRendah.length;

  return (
    <div style={{ ...styles.container, padding: isMobile ? "15px" : "30px" }}>
      
      {/* HEADER SECTION */}
      <div style={{ 
        ...styles.headerRow, 
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        gap: isMobile ? "15px" : "0"
      }}>
        <div>
          <h1 style={{ ...styles.adminTitle, fontSize: isMobile ? "22px" : "28px" }}>Admin Dashboard</h1>
          <p style={{ color: "#94a3b8", margin: 0 }}>Sabtu, 3 Januari 2026</p>
        </div>
        <button style={{ ...styles.btnPrint, width: isMobile ? "100%" : "auto" }} onClick={() => window.print()}>
          🖨️ Cetak Laporan PDF
        </button>
      </div>

      {/* MAIN CONTENT GRID */}
      <div style={{ 
        ...styles.mainGrid, 
        flexDirection: isMobile ? "column" : "row" 
      }}>
        
        {/* KOLOM KIRI */}
        <div style={{ ...styles.leftCol, width: "100%" }}>
          <div style={{ ...styles.welcomeCard, padding: isMobile ? "20px" : "30px" }}>
            <h2 style={{ fontSize: isMobile ? "18px" : "24px" }}>Selamat Datang Kembali! 👋</h2>
            <p>Sistem mendeteksi <b>{totalStokRendah}</b> barang dengan stok kritis.</p>
          </div>

          <div style={{ 
            ...styles.statsGrid, 
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", // 1 kolom di HP, 2 kolom di Laptop
            gap: isMobile ? "12px" : "20px"
          }}>
            <StatCard title="Total Kategori" value={data.categories.length} icon="🏷️" color="#4f46e5" />
            <StatCard title="Jenis Barang" value={data.items.length} icon="📦" color="#10b981" />
            <StatCard title="Total Supplier" value={data.suppliers.length} icon="🚚" color="#f59e0b" />
            <StatCard title="Barang Kritis" value={totalStokRendah} icon="⚠️" color="#ef4444" />
          </div>

          <div style={styles.card}>
            <h3 style={{ color: "#ef4444", marginTop: 0 }}>⚠️ Daftar Barang Stok Kritis</h3>
            <div style={{ overflowX: "auto" }}> {/* Agar tabel tidak merusak layout HP */}
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={{ textAlign: "left" }}>Nama Barang</th>
                    <th style={{ textAlign: "center" }}>Sisa Stok</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsStokRendah.length > 0 ? itemsStokRendah.map(it => (
                    <tr key={it.id} style={styles.tr}>
                      <td style={{ padding: "12px 0", fontWeight: "600" }}>{it.nama}</td>
                      <td style={{ textAlign: "center" }}>
                        <span style={styles.badgeAlert}>{it.stok} unit</span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="2" style={styles.emptyText}>✅ Stok aman.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN */}
        <div style={{ ...styles.rightCol, width: "100%" }}>
          <div style={styles.card}>
            <h3>Aktivitas Terkini</h3>
            <div style={styles.logContainer}>
              {data.logs.length > 0 ? data.logs.slice(0, 5).map(log => (
                <div key={log.id} style={styles.logItem}>
                  <div style={{...styles.logDot, backgroundColor: log.type === 'add' ? '#10b981' : log.type === 'delete' ? '#ef4444' : '#f59e0b'}}></div>
                  <div>
                    <p style={styles.logMsg}>{log.message}</p>
                    <span style={styles.logTime}>{log.time}</span>
                  </div>
                </div>
              )) : <p style={styles.emptyText}>Tidak ada aktivitas.</p>}
            </div>
          </div>

          {/* Sembunyikan visualisasi stok di HP agar tidak terlalu panjang, atau biarkan tetap ada */}
          <div style={styles.card}>
            <h3>Visualisasi Stok</h3>
            <div style={styles.chartArea}>
              {data.items.slice(0, 5).map((it, idx) => (
                <div key={idx} style={styles.barWrapper}>
                  <div style={{ ...styles.bar, height: `${Math.min(it.stok * 2, 80)}px` }}></div>
                  <span style={styles.barLabel}>{it.nama.slice(0, 6)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon, color }) => (
  <div style={{ ...styles.statCard, borderLeft: `6px solid ${color}` }}>
    <div><p style={styles.statLabel}>{title}</p><h2 style={{ margin: 0, fontSize: "20px" }}>{value}</h2></div>
    <div style={{ fontSize: "24px" }}>{icon}</div>
  </div>
);

const styles = {
  container: { backgroundColor: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
  headerRow: { display: "flex", justifyContent: "space-between", marginBottom: "30px" },
  adminTitle: { margin: 0, color: "#1e293b", fontWeight: "800" },
  btnPrint: { backgroundColor: "#4f46e5", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: "600" },
  mainGrid: { display: "flex", gap: "25px" },
  leftCol: { flex: 1.8, display: "flex", flexDirection: "column", gap: "25px" },
  rightCol: { flex: 1, display: "flex", flexDirection: "column", gap: "25px" },
  welcomeCard: { background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", borderRadius: "20px", color: "#fff", boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.2)" },
  statsGrid: { display: "grid", gap: "20px" },
  statCard: { background: "#fff", padding: "20px", borderRadius: "15px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" },
  statLabel: { color: "#64748b", margin: 0, fontSize: "13px", fontWeight: "600" },
  card: { background: "#fff", padding: "20px", borderRadius: "20px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { color: "#94a3b8", fontSize: "13px", borderBottom: "1px solid #f1f5f9" },
  tr: { borderBottom: "1px solid #f1f5f9" },
  badgeAlert: { backgroundColor: "#fee2e2", color: "#ef4444", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700" },
  logContainer: { display: "flex", flexDirection: "column", gap: "15px" },
  logItem: { display: "flex", gap: "12px" },
  logDot: { width: "10px", height: "10px", borderRadius: "50%", marginTop: "5px", flexShrink: 0 },
  logMsg: { margin: 0, fontSize: "14px", fontWeight: "500", color: "#334155" },
  logTime: { fontSize: "12px", color: "#94a3b8" },
  emptyText: { color: "#cbd5e1", textAlign: "center", padding: "20px", fontSize: "14px" },
  chartArea: { height: "100px", display: "flex", alignItems: "flex-end", gap: "15px", justifyContent: "center", borderBottom: "2px solid #f1f5f9", paddingBottom: "10px" },
  barWrapper: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" },
  bar: { width: "20px", backgroundColor: "#4f46e5", borderRadius: "6px 6px 0 0", transition: "height 0.3s ease" },
  barLabel: { fontSize: "10px", color: "#94a3b8", fontWeight: "600" }
};
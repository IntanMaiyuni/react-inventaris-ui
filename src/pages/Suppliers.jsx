import React, { useState, useEffect } from "react";
import { suppliersData as initialData } from "../data/store";

export default function Supplier() {
  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem("inventaris_suppliers");
    return saved ? JSON.parse(saved) : initialData;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState({ id: "", nama: "", kontak: "", alamat: "" });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    localStorage.setItem("inventaris_suppliers", JSON.stringify(suppliers));
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [suppliers]);

  const handleSave = (e) => {
    e.preventDefault();
    const logs = JSON.parse(localStorage.getItem("inventaris_logs") || "[]");
    if (isEditing) {
      setSuppliers(suppliers.map(s => s.id === currentSupplier.id ? currentSupplier : s));
      logs.unshift({ id: Date.now(), message: `Update supplier: ${currentSupplier.nama}`, type: 'edit', time: new Date().toLocaleTimeString() });
    } else {
      setSuppliers([...suppliers, { ...currentSupplier, id: Date.now() }]);
      logs.unshift({ id: Date.now(), message: `Tambah supplier: ${currentSupplier.nama}`, type: 'add', time: new Date().toLocaleTimeString() });
    }
    localStorage.setItem("inventaris_logs", JSON.stringify(logs.slice(0, 5)));
    setIsModalOpen(false);
  };

  return (
    <div style={{...styles.container, padding: isMobile ? "15px" : "30px"}}>
      <h2 style={{ marginBottom: "25px", color: "#1e293b" }}>🚚 Data Supplier</h2>

      <div style={{...styles.statsRow, flexDirection: isMobile ? "column" : "row"}}>
        <div style={{...styles.statCard, width: isMobile ? "100%" : "250px"}}>
          <p style={styles.statLabel}>Total Mitra</p>
          <h3 style={{ margin: "5px 0", fontSize: "32px", color: "#f59e0b" }}>{suppliers.length}</h3>
        </div>
      </div>

      <div style={styles.tableCard}>
        <div style={{...styles.headerSection, flexDirection: isMobile ? "column" : "row", gap: "15px", alignItems: isMobile ? "flex-start" : "center"}}>
          <h3 style={{ margin: 0 }}>Daftar Supplier</h3>
          <button style={{...styles.btnAdd, width: isMobile ? "100%" : "auto"}} onClick={() => { setCurrentSupplier({id:"", nama:"", kontak:"", alamat:""}); setIsEditing(false); setIsModalOpen(true); }}>
            + Supplier Baru
          </button>
        </div>

        <div style={{overflowX: "auto"}}>
          <table style={{...styles.table, minWidth: isMobile ? "700px" : "100%"}}>
            <thead>
              <tr style={styles.theadRow}>
                <th style={styles.th}>No</th>
                <th style={styles.th}>Nama Supplier</th>
                <th style={styles.th}>Kontak</th>
                <th style={styles.th}>Alamat</th>
                <th style={{...styles.th, textAlign: "center"}}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((sup, index) => (
                <tr key={sup.id} style={styles.tr}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={{...styles.td, fontWeight: "600"}}>{sup.nama}</td>
                  <td style={styles.td}>{sup.kontak}</td>
                  <td style={styles.td}>{sup.alamat}</td>
                  <td style={{...styles.td, textAlign: "center", whiteSpace: "nowrap"}}>
                    <button style={styles.btnEdit} onClick={() => { setCurrentSupplier(sup); setIsEditing(true); setIsModalOpen(true); }}>✏️ Edit</button>
                    <button style={styles.btnDelete} onClick={() => { if(window.confirm(`Hapus ${sup.nama}?`)) setSuppliers(suppliers.filter(s => s.id !== sup.id)); }}>🗑️ Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={{...styles.modalContent, width: isMobile ? "90%" : "400px"}}>
            <h3 style={{marginTop:0}}>{isEditing ? "✏️ Ubah Supplier" : "➕ Tambah Supplier"}</h3>
            <form onSubmit={handleSave}>
              <input placeholder="Nama Supplier" style={styles.input} value={currentSupplier.nama} onChange={(e) => setCurrentSupplier({...currentSupplier, nama: e.target.value})} required />
              <input placeholder="Kontak (WA/Email)" style={styles.input} value={currentSupplier.kontak} onChange={(e) => setCurrentSupplier({...currentSupplier, kontak: e.target.value})} required />
              <textarea placeholder="Alamat Lengkap" style={{...styles.input, height: "80px", resize: "none"}} value={currentSupplier.alamat} onChange={(e) => setCurrentSupplier({...currentSupplier, alamat: e.target.value})} required />
              <div style={{display:"flex", gap:"10px", justifyContent:"flex-end"}}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={styles.btnCancel}>Batal</button>
                <button type="submit" style={styles.btnSave}>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { backgroundColor: "#f8fafc", minHeight: "100vh" },
  statsRow: { display: "flex", gap: "20px", marginBottom: "30px" },
  statCard: { background: "#fff", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", borderLeft: "6px solid #f59e0b", boxSizing: "border-box" },
  statLabel: { color: "#64748b", fontSize: "14px", fontWeight: "600", margin: 0 },
  tableCard: { background: "#fff", borderRadius: "15px", padding: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" },
  headerSection: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
  btnAdd: { backgroundColor: "#4f46e5", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: "600", boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)" },
  table: { width: "100%", borderCollapse: "collapse" },
  theadRow: { backgroundColor: "#f8fafc", textAlign: "left" },
  th: { padding: "15px", color: "#475569", fontSize: "14px", fontWeight: "600" },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "15px", color: "#334155", fontSize: "14px" },
  btnEdit: { background: "#fffbeb", color: "#d97706", border: "1px solid #fde68a", padding: "6px 12px", borderRadius: "8px", marginRight: "8px", cursor: "pointer", fontWeight: "600" },
  btnDelete: { background: "#fef2f2", color: "#dc2626", border: "1px solid #fee2e2", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15, 23, 42, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modalContent: { background: "white", padding: "30px", borderRadius: "15px", boxSizing: "border-box" },
  input: { width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" },
  btnSave: { padding: "10px 20px", background: "#4f46e5", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  btnCancel: { padding: "10px 20px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }
};
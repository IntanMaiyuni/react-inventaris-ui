import React, { useState, useEffect } from "react";
import { categoriesData as initialData } from "../data/store";

export default function Categories() {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("inventaris_categories");
    return saved ? JSON.parse(saved) : initialData;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ id: "", nama: "" });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    localStorage.setItem("inventaris_categories", JSON.stringify(categories));
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [categories]);

  const handleSave = (e) => {
    e.preventDefault();
    const logs = JSON.parse(localStorage.getItem("inventaris_logs") || "[]");
    if (isEditing) {
      setCategories(categories.map(c => c.id === currentCategory.id ? currentCategory : c));
      logs.unshift({ id: Date.now(), message: `Mengubah kategori: ${currentCategory.nama}`, type: 'edit', time: new Date().toLocaleTimeString() });
    } else {
      setCategories([...categories, { ...currentCategory, id: Date.now() }]);
      logs.unshift({ id: Date.now(), message: `Menambah kategori: ${currentCategory.nama}`, type: 'add', time: new Date().toLocaleTimeString() });
    }
    localStorage.setItem("inventaris_logs", JSON.stringify(logs.slice(0, 5)));
    setIsModalOpen(false);
  };

  return (
    <div style={{...styles.container, padding: isMobile ? "15px" : "30px"}}>
      <div style={{...styles.headerSection, flexDirection: isMobile ? "column" : "row", gap: "15px", alignItems: isMobile ? "flex-start" : "center"}}>
        <h2 style={{ margin: 0 }}>📂 Data Kategori</h2>
        <button style={{...styles.btnAdd, width: isMobile ? "100%" : "auto"}} onClick={() => { setCurrentCategory({id: "", nama: ""}); setIsEditing(false); setIsModalOpen(true); }}>
          + Kategori Baru
        </button>
      </div>

      <div style={{...styles.tableCard, overflowX: "auto"}}>
        <table style={{...styles.table, minWidth: isMobile ? "400px" : "100%"}}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={{...styles.th, width: "70px"}}>No</th>
              <th style={styles.th}>Nama Kategori</th>
              <th style={{...styles.th, textAlign: "center"}}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr key={cat.id} style={styles.tr}>
                <td style={styles.td}>{index + 1}</td>
                <td style={{...styles.td, fontWeight: "600"}}>{cat.nama}</td>
                <td style={{...styles.td, textAlign: "center", whiteSpace: "nowrap"}}>
                  <button style={styles.btnEdit} onClick={() => { setCurrentCategory(cat); setIsEditing(true); setIsModalOpen(true); }}>✏️ Edit</button>
                  <button style={styles.btnDelete} onClick={() => { if(window.confirm(`Hapus ${cat.nama}?`)) setCategories(categories.filter(c => c.id !== cat.id)); }}>🗑️ Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={{...styles.modalContent, width: isMobile ? "90%" : "380px"}}>
            <h3 style={{marginTop:0}}>{isEditing ? "✏️ Ubah Kategori" : "➕ Tambah Kategori"}</h3>
            <form onSubmit={handleSave}>
              <input style={styles.input} placeholder="Contoh: Elektronik" value={currentCategory.nama} onChange={(e) => setCurrentCategory({...currentCategory, nama: e.target.value})} required />
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
  headerSection: { display: "flex", justifyContent: "space-between", marginBottom: "25px" },
  btnAdd: { background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: "600", boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)" },
  tableCard: { background: "#fff", borderRadius: "15px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" },
  table: { width: "100%", borderCollapse: "collapse" },
  theadRow: { backgroundColor: "#f1f5f9", textAlign: "left" },
  th: { padding: "15px", color: "#475569", fontSize: "14px" },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "15px", fontSize: "14px", color: "#334155" },
  btnEdit: { background: "#fffbeb", color: "#d97706", border: "1px solid #fde68a", padding: "6px 12px", borderRadius: "8px", marginRight: "8px", cursor: "pointer", fontWeight: "600" },
  btnDelete: { background: "#fef2f2", color: "#dc2626", border: "1px solid #fee2e2", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modalContent: { background: "white", padding: "25px", borderRadius: "15px" },
  input: { width: "100%", padding: "12px", margin: "10px 0 20px 0", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" },
  btnSave: { padding: "10px 20px", background: "#4f46e5", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  btnCancel: { padding: "10px 20px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }
};
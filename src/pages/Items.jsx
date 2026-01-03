import React, { useState, useEffect } from "react";
import { itemsData as initialItems, categoriesData as initialCategories } from "../data/store";

export default function Items() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("inventaris_items");
    return saved ? JSON.parse(saved) : initialItems;
  });
  const [categories] = useState(() => {
    const saved = localStorage.getItem("inventaris_categories");
    return saved ? JSON.parse(saved) : initialCategories;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState({ id: "", nama: "", kategori: "", stok: "" });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    localStorage.setItem("inventaris_items", JSON.stringify(items));
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [items]);

  const saveLog = (msg, type) => {
    const logs = JSON.parse(localStorage.getItem("inventaris_logs") || "[]");
    const newLog = { id: Date.now(), message: msg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), type };
    localStorage.setItem("inventaris_logs", JSON.stringify([newLog, ...logs].slice(0, 5)));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (isEditing) {
      setItems(items.map((it) => (it.id === currentItem.id ? currentItem : it)));
      saveLog(`Mengubah barang: ${currentItem.nama}`, "edit");
    } else {
      setItems([...items, { ...currentItem, id: Date.now() }]);
      saveLog(`Menambah barang baru: ${currentItem.nama}`, "add");
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{...styles.container, padding: isMobile ? "15px" : "30px"}}>
      <div style={{...styles.header, flexDirection: isMobile ? "column" : "row", gap: "15px"}}>
        <h2 style={{ margin: 0, color: "#1e293b" }}>📦 Manajemen Barang</h2>
        <button style={{...styles.btnAdd, width: isMobile ? "100%" : "auto"}} 
          onClick={() => { setCurrentItem({ id: "", nama: "", kategori: "", stok: "" }); setIsEditing(false); setIsModalOpen(true); }}>
          <span>+</span> Tambah Barang Baru
        </button>
      </div>

      <div style={styles.searchBar}>
        🔍 <input style={styles.searchInput} placeholder="Cari nama barang..." onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div style={{...styles.tableCard, overflowX: "auto"}}>
        <table style={{...styles.table, minWidth: isMobile ? "600px" : "100%"}}>
          <thead>
            <tr style={styles.thead}>
              <th style={{ padding: "15px" }}>Nama Barang</th>
              <th>Kategori</th>
              <th>Stok</th>
              <th style={{ textAlign: "center" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.filter(it => it.nama.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
              <tr key={item.id} style={styles.tr}>
                <td style={{ padding: "15px", fontWeight: "600", color: "#334155" }}>{item.nama}</td>
                <td><span style={styles.badge}>{item.kategori}</span></td>
                <td style={{ fontWeight: "bold", color: Number(item.stok) < 10 ? "#ef4444" : "#1e293b" }}>
                  {item.stok} {Number(item.stok) < 10 && "⚠️"}
                </td>
                <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  <button style={styles.btnEdit} onClick={() => { setCurrentItem(item); setIsEditing(true); setIsModalOpen(true); }}>✏️ Edit</button>
                  <button style={styles.btnDelete} onClick={() => { if(window.confirm(`Hapus ${item.nama}?`)) { setItems(items.filter(i => i.id !== item.id)); saveLog(`Menghapus barang: ${item.nama}`, "delete"); } }}>🗑️ Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={styles.overlay}>
          <div style={{...styles.modal, width: isMobile ? "90%" : "450px"}}>
            <h3 style={{ marginTop: 0 }}>{isEditing ? "✏️ Edit Barang" : "➕ Tambah Barang"}</h3>
            <form onSubmit={handleSave}>
              <label style={styles.label}>Nama Barang</label>
              <input style={styles.input} value={currentItem.nama} onChange={(e) => setCurrentItem({...currentItem, nama: e.target.value})} required />
              <label style={styles.label}>Kategori</label>
              <select style={styles.input} value={currentItem.kategori} onChange={(e) => setCurrentItem({...currentItem, kategori: e.target.value})} required>
                <option value="">Pilih Kategori</option>
                {categories.map(c => <option key={c.id} value={c.nama}>{c.nama}</option>)}
              </select>
              <label style={styles.label}>Jumlah Stok</label>
              <input style={styles.input} type="number" value={currentItem.stok} onChange={(e) => setCurrentItem({...currentItem, stok: e.target.value})} required />
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={styles.btnCancel}>Batal</button>
                <button type="submit" style={styles.btnSave}>Simpan Data</button>
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
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  btnAdd: { background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "12px", cursor: "pointer", fontWeight: "600", boxShadow: "0 4px 15px rgba(79, 70, 229, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
  searchBar: { background: "#fff", padding: "12px 20px", borderRadius: "12px", marginBottom: "20px", display: "flex", alignItems: "center", border: "1px solid #e2e8f0" },
  searchInput: { border: "none", outline: "none", marginLeft: "10px", width: "100%" },
  tableCard: { background: "#fff", borderRadius: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", border: "1px solid #e2e8f0" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { textAlign: "left", color: "#94a3b8", fontSize: "13px", textTransform: "uppercase", background: "#f8fafc" },
  tr: { borderBottom: "1px solid #f1f5f9" },
  badge: { background: "#eff6ff", color: "#2563eb", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" },
  btnEdit: { background: "#fffbeb", color: "#d97706", border: "1px solid #fde68a", padding: "6px 14px", borderRadius: "8px", marginRight: "8px", cursor: "pointer", fontWeight: "600" },
  btnDelete: { background: "#fef2f2", color: "#dc2626", border: "1px solid #fee2e2", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modal: { background: "#fff", padding: "25px", borderRadius: "20px" },
  label: { display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "600", color: "#64748b" },
  input: { width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "10px", border: "1px solid #e2e8f0", boxSizing: "border-box" },
  btnSave: { background: "#4f46e5", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: "600" },
  btnCancel: { background: "#f1f5f9", color: "#64748b", border: "none", padding: "12px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: "600" }
};
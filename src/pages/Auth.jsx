import React, { useState } from "react";

export default function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "", email: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      // Simpan akun baru ke LocalStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      users.push(formData);
      localStorage.setItem("users", JSON.stringify(users));
      alert("Registrasi Berhasil! Silakan Login.");
      setIsRegister(false);
    } else {
      // Cek Login
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userFound = users.find(u => u.username === formData.username && u.password === formData.password);
      
      if (userFound || (formData.username === "admin" && formData.password === "admin")) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("currentUser", formData.username);
        onLogin(); // Beritahu App.js bahwa login sukses
      } else {
        alert("Username atau Password Salah!");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          {isRegister ? "Buat Akun Baru" : "Login Inventaris"}
        </h2>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input 
              style={styles.input} 
              placeholder="Email" 
              type="email" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              required 
            />
          )}
          <input 
            style={styles.input} 
            placeholder="Username" 
            onChange={(e) => setFormData({...formData, username: e.target.value})} 
            required 
          />
          <input 
            style={styles.input} 
            placeholder="Password" 
            type="password" 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            required 
          />
          <button style={styles.btnPrimary} type="submit">
            {isRegister ? "Daftar" : "Masuk"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "15px", fontSize: "14px" }}>
          {isRegister ? "Sudah punya akun?" : "Belum punya akun?"} 
          <span style={styles.link} onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? " Login" : " Daftar Sekarang"}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f1f5f9" },
  card: { background: "#fff", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", width: "350px" },
  input: { width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "10px", border: "1px solid #e2e8f0", boxSizing: "border-box" },
  btnPrimary: { width: "100%", padding: "12px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600" },
  link: { color: "#4f46e5", cursor: "pointer", fontWeight: "bold" }
};
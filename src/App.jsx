import React, { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Items from "./pages/Items";
import Categories from "./pages/Categories";
import Supplier from "./pages/Suppliers";
import Auth from "./pages/Auth";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  
  // 1. Deteksi lebar layar untuk mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn");
    if (status === "true") {
      setIsLoggedIn(true);
    }

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("currentUser");
      setIsLoggedIn(false);
      setCurrentPage("dashboard");
    }
  };

  if (!isLoggedIn) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div style={appStyles.layout}>
      {/* NAVBAR RESPONSIF */}
      <nav style={{ 
        ...appStyles.navbar, 
        padding: isMobile ? "10px 15px" : "15px 50px", // Padding kecil di HP
        flexDirection: isMobile ? "column" : "row",   // Tumpuk navbar di HP
        gap: isMobile ? "10px" : "0"
      }}>
        <div style={appStyles.logo}>InventarisPro</div>
        
        <div style={{ 
          ...appStyles.navLinks, 
          gap: isMobile ? "12px" : "25px",
          fontSize: isMobile ? "14px" : "16px" 
        }}>
          <span 
            style={currentPage === "dashboard" ? appStyles.activeLink : appStyles.link} 
            onClick={() => setCurrentPage("dashboard")}
          >Dashboard</span>
          <span 
            style={currentPage === "items" ? appStyles.activeLink : appStyles.link} 
            onClick={() => setCurrentPage("items")}
          >Barang</span>
          <span 
            style={currentPage === "categories" ? appStyles.activeLink : appStyles.link} 
            onClick={() => setCurrentPage("categories")}
          >Kategori</span>
          <span 
            style={currentPage === "supplier" ? appStyles.activeLink : appStyles.link} 
            onClick={() => setCurrentPage("supplier")}
          >Supplier</span>
        </div>

        <button style={{ 
          ...appStyles.logoutBtn, 
          width: isMobile ? "100%" : "auto" // Tombol logout lebar di HP
        }} onClick={handleLogout}>Logout</button>
      </nav>

      {/* CONTENT AREA */}
      <div style={{ 
        ...appStyles.content, 
        padding: isMobile ? "10px" : "20px" 
      }}>
        {currentPage === "dashboard" && <Dashboard />}
        {currentPage === "items" && <Items />}
        {currentPage === "categories" && <Categories />}
        {currentPage === "supplier" && <Supplier />}
      </div>
    </div>
  );
}

const appStyles = {
  layout: { fontFamily: "'Inter', sans-serif", backgroundColor: "#f1f5f9", minHeight: "100vh" },
  navbar: { 
    display: "flex", justifyContent: "space-between", alignItems: "center", 
    background: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    position: "sticky", top: 0, zIndex: 100
  },
  logo: { fontSize: "22px", fontWeight: "bold", color: "#4f46e5" },
  navLinks: { display: "flex", flexWrap: "wrap", justifyContent: "center" },
  link: { cursor: "pointer", color: "#64748b", fontWeight: "500", transition: "0.3s" },
  activeLink: { cursor: "pointer", color: "#4f46e5", fontWeight: "700", borderBottom: "2px solid #4f46e5" },
  logoutBtn: { background: "#fee2e2", color: "#ef4444", border: "none", padding: "8px 18px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  content: { width: "100%", boxSizing: "border-box" }
};
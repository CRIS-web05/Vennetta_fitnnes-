import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import './App.css';

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Membresias from "./components/Membresias";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import Redes from "./components/Redes";
import Ubicacion from "./components/Ubicacion";
import Footer from "./components/Footer";
import SobreNosotros from "./components/SobreNosotros";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import AdminPanel from "./components/AdminPanel";
import AccessibilityWidget from "./components/AccessibilityWidget";
import AssistantWidget from "./components/AssistantWidget";
import LanguageSelector from "./components/LanguageSelector";
import EmprendedoresSection from "./components/EmprendedoresSection";
import RutinasManager from "./components/RutinasManager";
import SucursalesManager from "./components/SucursalesManager";

import Intro from "./components/Intro";
import ScrollToTop from "./components/ScrollToTop";
import Login from "./components/Login";
import RoleGuard from "./components/RoleGuard";
import { getCurrentUser, clearSession } from "./utils/auth";
import { useState } from "react";

const languageOptions = [
  { code: "es", label: "Español", emoji: "🇪🇸" },
  { code: "en", label: "English", emoji: "🇬🇧" },
  { code: "pt", label: "Português", emoji: "🇧🇷" },
  { code: "fr", label: "Français", emoji: "🇫🇷" },
  { code: "de", label: "Deutsch", emoji: "🇩🇪" },
  { code: "it", label: "Italiano", emoji: "🇮🇹" },
  { code: "ru", label: "Русский", emoji: "🇷🇺" },
  { code: "ja", label: "日本語", emoji: "🇯🇵" },
  { code: "ko", label: "한국어", emoji: "🇰🇷" },
  { code: "zh", label: "中文", emoji: "🇨🇳" },
  { code: "ar", label: "العربية", emoji: "🇸🇦" },
  { code: "hi", label: "हिंदी", emoji: "🇮🇳" },
  { code: "nl", label: "Nederlands", emoji: "🇳🇱" },
  { code: "sv", label: "Svenska", emoji: "🇸🇪" },
  { code: "no", label: "Norsk", emoji: "🇳🇴" },
  { code: "da", label: "Dansk", emoji: "🇩🇰" },
  { code: "fi", label: "Suomi", emoji: "🇫🇮" },
  { code: "tr", label: "Türkçe", emoji: "🇹🇷" },
  { code: "pl", label: "Polski", emoji: "🇵🇱" },
  { code: "id", label: "Bahasa Indonesia", emoji: "🇮🇩" },
];

function App(){

return (
  <Router>
    <AppContent />
  </Router>
);

}

function AppContent() {
const navigate = useNavigate();
const [cargando, setCargando] = useState(true);
const [isLoggedIn, setIsLoggedIn] = useState(() => {
  return localStorage.getItem("isLoggedIn") === "true";
});
const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
const [selectedLanguage, setSelectedLanguage] = useState(() => {
  const stored = localStorage.getItem("selectedLanguage");
  return languageOptions.find((option) => option.code === stored) || languageOptions[0];
});

const handleLoginSuccess = () => {
  setCurrentUser(getCurrentUser());
  setIsLoggedIn(true);
};

const handleLogout = () => {
  clearSession();
  setCurrentUser(null);
  setIsLoggedIn(false);
  navigate("/", { replace: true });
};

const handleLanguageChange = (option) => {
  setSelectedLanguage(option);
  localStorage.setItem("selectedLanguage", option.code);
};

return(

<>
  <LanguageSelector
  selectedLanguage={selectedLanguage}
  languageOptions={languageOptions}
  onLanguageChange={handleLanguageChange}
  />

  <AccessibilityWidget selectedLanguage={selectedLanguage} />
  <AssistantWidget selectedLanguage={selectedLanguage} />
  <ScrollToTop />
  {cargando && <Intro onFinish={() => setCargando(false)} />}

  {!cargando && (
    !isLoggedIn ? (
      <Login
        onLoginSuccess={handleLoginSuccess}
        selectedLanguage={selectedLanguage}
        languageOptions={languageOptions}
        onLanguageChange={handleLanguageChange}
      />
    ) : (
      <>
        <Navbar
          onLogout={handleLogout}
          selectedLanguage={selectedLanguage}
          user={currentUser}
        />

        <div className="app-content">
          <Routes>

            {/* 🔥 SOLO HERO */}
            <Route path="/" element={<Hero selectedLanguage={selectedLanguage} />} />

            {/* 🔥 PÁGINAS SEPARADAS */}
            <Route
              path="/membresias"
              element={<Membresias selectedLanguage={selectedLanguage} />}
            />
            <Route
              path="/rutinas"
              element={
                <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
                  <RutinasManager selectedLanguage={selectedLanguage} />
                </div>
              }
            />
            <Route
              path="/sucursales"
              element={
                <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
                  <SucursalesManager selectedLanguage={selectedLanguage} />
                </div>
              }
            />
            <Route
              path="/emprendedores"
              element={
                <RoleGuard roles={["superadmin", "admin_gym"]}>
                  <EmprendedoresSection selectedLanguage={selectedLanguage} />
                </RoleGuard>
              }
            />
            <Route
              path="/galeria"
              element={<Gallery selectedLanguage={selectedLanguage} />}
            />
            <Route
              path="/ubicacion"
              element={<Ubicacion selectedLanguage={selectedLanguage} />}
            />
            <Route
              path="/contacto"
              element={<Contact selectedLanguage={selectedLanguage} />}
            />
            <Route
              path="/sobre-nosotros"
              element={<SobreNosotros selectedLanguage={selectedLanguage} />}
            />
            <Route
              path="/profile"
              element={<Profile selectedLanguage={selectedLanguage} languageCount={languageOptions.length} />}
            />
            <Route
              path="/admin"
              element={
                <RoleGuard roles={["superadmin", "admin_gym"]}>
                  <AdminPanel selectedLanguage={selectedLanguage} />
                </RoleGuard>
              }
            />
            <Route
              path="/dashboard"
              element={
                <RoleGuard roles={["superadmin", "admin_gym"]}>
                  <Dashboard
                    selectedLanguage={selectedLanguage}
                    languageCount={languageOptions.length}
                  />
                </RoleGuard>
              }
            />

          </Routes>

          <Redes selectedLanguage={selectedLanguage} />
          <Footer selectedLanguage={selectedLanguage} />
        </div>
      </>
    )
  )}

</>

)

}

export default App;
import { useEffect, useState } from "react";
import "../App.css";

const translations = {
  es: {
    profileTitle: "Mi Perfil",
    profileDesc: "Administra tu cuenta y actualiza tus datos.",
    usernameLabel: "Usuario",
    emailLabel: "Correo electrónico",
    fullNameLabel: "Nombre completo",
    uploadPhotoLabel: "Subir foto de perfil",
    passwordLabel: "Contraseña",
    confirmPasswordLabel: "Confirmar contraseña",
    saveButton: "Guardar cambios",
    profileSaved: "Perfil actualizado correctamente.",
    passwordMismatch: "Las contraseñas no coinciden.",
    noUserMessage: "No se encontró el usuario. Por favor inicia sesión nuevamente.",
  },
  en: {
    profileTitle: "My Profile",
    profileDesc: "Manage your account and update your details.",
    usernameLabel: "Username",
    emailLabel: "Email",
    fullNameLabel: "Full name",
    uploadPhotoLabel: "Upload profile photo",
    passwordLabel: "Password",
    confirmPasswordLabel: "Confirm password",
    saveButton: "Save changes",
    profileSaved: "Profile updated successfully.",
    passwordMismatch: "Passwords do not match.",
    noUserMessage: "No user found. Please log in again.",
  },
};

function Profile({ selectedLanguage, languageCount }) {
  const locale = selectedLanguage?.code || "es";
  const t = translations[locale] || translations.es;

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setUsername(parsed.username || "");
      setEmail(parsed.email || "");
      setFullName(parsed.fullName || parsed.username || "");
      setAvatarUrl(parsed.avatarUrl || "");
    }
  }, []);

  const handleSave = () => {
    if (!user) return;

    if (password && password !== confirmPassword) {
      setMessage(t.passwordMismatch);
      return;
    }

    const updatedUser = {
      ...user,
      username: username.trim() || user.username,
      email: email.trim() || user.email,
      fullName: fullName.trim() || user.username,
      avatarUrl,
      password: password ? password : user.password || "",
    };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setPassword("");
    setConfirmPassword("");
    setMessage(t.profileSaved);
    window.setTimeout(() => setMessage(""), 3200);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result || "");
    };
    reader.readAsDataURL(file);
  };

  const getInitials = () => {
    const name = fullName || username || user?.username || "U";
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase())
      .slice(0, 2)
      .join("");
  };

  if (!user) {
    return (
      <section className="profile-section">
        <div className="profile-card profile-empty">
          <p>{t.noUserMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="profile-section">
      <div className="profile-card profile-card-expanded">
        <header className="profile-header">
          <div className="profile-avatar-wrapper">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`Fotografía oficial de perfil del usuario registrado en Vendetta Fitness mostrando avatar personalizado con bordes circulares`}
                className="profile-avatar"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/180/000000/FF0000?text=Perfil";
                }}
              />
            ) : (
              <div className="profile-avatar profile-avatar-placeholder">
                {getInitials()}
              </div>
            )}
          </div>
          <div className="profile-summary">
            <h2>{t.profileTitle}</h2>
            <p>{t.profileDesc}</p>
          </div>
        </header>

        <div className="profile-info-grid">
          <div className="profile-info-card">
            <span>{t.usernameLabel}</span>
            <strong>{user.username}</strong>
          </div>
          <div className="profile-info-card">
            <span>{t.emailLabel}</span>
            <strong>{user.email}</strong>
          </div>
        </div>

        <div className="profile-form">
          <label>
            {t.usernameLabel}
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t.usernameLabel}
            />
          </label>

          <label>
            {t.emailLabel}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailLabel}
            />
          </label>

          <label>
            {t.fullNameLabel}
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t.fullNameLabel}
            />
          </label>

          <label className="profile-file-label">
            {t.uploadPhotoLabel}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>

          <label>
            {t.passwordLabel}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.passwordLabel}
            />
          </label>

          <label>
            {t.confirmPasswordLabel}
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t.confirmPasswordLabel}
            />
          </label>

          <button type="button" className="profile-save-btn" onClick={handleSave}>
            {t.saveButton}
          </button>
          {message && <p className="profile-message">{message}</p>}
        </div>
      </div>
    </section>
  );
}

export default Profile;

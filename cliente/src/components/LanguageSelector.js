import { useState, useEffect, useRef } from "react";
import "../styles/language-selector.css";

function LanguageSelector({ selectedLanguage, languageOptions, onLanguageChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="language-selector-global" ref={containerRef}>
      <button
        type="button"
        className="language-selector-global-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{selectedLanguage?.emoji ?? "🌐"}</span>
        <span>{selectedLanguage?.label ?? "Idioma"}</span>
        <span className="language-selector-global-arrow">▾</span>
      </button>

      {open && (
        <ul className="language-selector-global-menu" role="listbox" aria-label="Language selector">
          {languageOptions.map((option) => (
            <li key={option.code}>
              <button
                type="button"
                className={`language-selector-global-option ${selectedLanguage?.code === option.code ? "selected" : ""}`}
                role="option"
                aria-selected={selectedLanguage?.code === option.code}
                onClick={() => {
                  onLanguageChange(option);
                  setOpen(false);
                }}
              >
                <span>{option.emoji}</span>
                <span>{option.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LanguageSelector;

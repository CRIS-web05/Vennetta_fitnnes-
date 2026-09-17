import React, { useEffect, useState } from "react";
import "../styles/accessibility.css";
import { getTranslation } from "../translations";

const accessibilityTranslations = {
  es: {
    accessibilityLabel: "Accesibilidad",
    title: "Opciones de Accesibilidad",
    increaseText: "Aumentar texto",
    decreaseText: "Disminuir texto",
    textSizeLabel: "Tamaño de fuente",
    highContrast: "Alto contraste",
    darkMode: "Modo oscuro",
    highlightLinks: "Resaltar enlaces",
    largeCursor: "Cursor grande",
    readableFont: "Fuente de lectura fácil",
    invertColors: "Invertir colores",
    grayscaleMode: "Escala de grises",
    speechReader: "Lectura por voz (Text-to-Speech)",
    readingGuide: "Guía de lectura flotante",
    resetSettings: "Restablecer ajustes",
    activeBadge: "activas",
    close: "Cerrar",
  },
  en: {
    accessibilityLabel: "Accessibility",
    title: "Accessibility Options",
    increaseText: "Increase text",
    decreaseText: "Decrease text",
    textSizeLabel: "Font size",
    highContrast: "High contrast",
    darkMode: "Dark mode",
    highlightLinks: "Highlight links",
    largeCursor: "Large cursor",
    readableFont: "Dyslexia-friendly font",
    invertColors: "Invert colors",
    grayscaleMode: "Grayscale mode",
    speechReader: "Text-to-Speech Reader",
    readingGuide: "Reading Guide Ruler",
    resetSettings: "Reset all settings",
    activeBadge: "active",
    close: "Close",
  },
};

const STORAGE_KEY = "web_accessibility_settings";

function AccessibilityWidget({ selectedLanguage }) {
  const locale = selectedLanguage?.code || "es";
  const globalT = getTranslation(locale, "accessibility");
  const fallbackT = accessibilityTranslations[locale] || accessibilityTranslations.en || accessibilityTranslations.es;
  const t = { ...fallbackT, ...globalT };

  const [open, setOpen] = useState(false);
  const [guideTop, setGuideTop] = useState(0);

  // Saved preferences or defaults
  const getInitialState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not read accessibility settings", e);
    }
    return {};
  };

  const initial = getInitialState();

  const [textScale, setTextScale] = useState(initial.textScale ?? 1);
  const [highContrast, setHighContrast] = useState(initial.highContrast ?? false);
  const [darkMode, setDarkMode] = useState(initial.darkMode ?? false);
  const [highlightLinks, setHighlightLinks] = useState(initial.highlightLinks ?? false);
  const [largeCursor, setLargeCursor] = useState(initial.largeCursor ?? false);
  const [readableFont, setReadableFont] = useState(initial.readableFont ?? false);
  const [invertColors, setInvertColors] = useState(initial.invertColors ?? false);
  const [grayscaleMode, setGrayscaleMode] = useState(initial.grayscaleMode ?? false);
  const [speechReader, setSpeechReader] = useState(initial.speechReader ?? false);
  const [readingGuide, setReadingGuide] = useState(initial.readingGuide ?? false);

  // Active features count
  const activeCount =
    (textScale !== 1 ? 1 : 0) +
    (highContrast ? 1 : 0) +
    (darkMode ? 1 : 0) +
    (highlightLinks ? 1 : 0) +
    (largeCursor ? 1 : 0) +
    (readableFont ? 1 : 0) +
    (invertColors ? 1 : 0) +
    (grayscaleMode ? 1 : 0) +
    (speechReader ? 1 : 0) +
    (readingGuide ? 1 : 0);

  // Persistence effect
  useEffect(() => {
    try {
      const settings = {
        textScale,
        highContrast,
        darkMode,
        highlightLinks,
        largeCursor,
        readableFont,
        invertColors,
        grayscaleMode,
        speechReader,
        readingGuide,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn("Could not save accessibility settings", e);
    }
  }, [
    textScale,
    highContrast,
    darkMode,
    highlightLinks,
    largeCursor,
    readableFont,
    invertColors,
    grayscaleMode,
    speechReader,
    readingGuide,
  ]);

  // Apply DOM modifications
  useEffect(() => {
    if (textScale === 1) {
      document.documentElement.style.fontSize = "";
    } else {
      document.documentElement.style.fontSize = `${textScale * 100}%`;
    }
  }, [textScale]);

  useEffect(() => {
    document.body.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.body.classList.toggle("highlight-links", highlightLinks);
  }, [highlightLinks]);

  useEffect(() => {
    document.body.classList.toggle("large-cursor", largeCursor);
  }, [largeCursor]);

  useEffect(() => {
    document.body.classList.toggle("readable-font", readableFont);
  }, [readableFont]);

  useEffect(() => {
    document.documentElement.classList.toggle("invert-colors", invertColors);
  }, [invertColors]);

  useEffect(() => {
    document.documentElement.classList.toggle("grayscale-mode", grayscaleMode);
  }, [grayscaleMode]);

  // Speech Reader Handler
  useEffect(() => {
    if (!speechReader) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      document.body.classList.remove("speech-reader-active");
      return;
    }

    document.body.classList.add("speech-reader-active");

    const handleSpeak = (e) => {
      if (!window.speechSynthesis) return;
      const target = e.target;
      if (target.closest(".accessibility-widget")) return;

      const text =
        target.innerText ||
        target.getAttribute("aria-label") ||
        target.getAttribute("alt") ||
        target.getAttribute("placeholder");

      if (text && text.trim().length > 0) {
        window.speechSynthesis.cancel();
        const speechText = text.trim().substring(0, 180);
        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.lang = locale === "es" ? "es-ES" : locale === "en" ? "en-US" : locale;
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    };

    document.addEventListener("click", handleSpeak);
    return () => {
      document.removeEventListener("click", handleSpeak);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      document.body.classList.remove("speech-reader-active");
    };
  }, [speechReader, locale]);

  // Reading Guide Handler
  useEffect(() => {
    if (!readingGuide) return;
    const handleMouseMove = (e) => {
      setGuideTop(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [readingGuide]);

  const adjustText = (delta) => {
    setTextScale((prev) => {
      const next = Math.min(1.6, Math.max(0.8, prev + delta));
      return Number(next.toFixed(2));
    });
  };

  const resetAccessibility = () => {
    setTextScale(1);
    setHighContrast(false);
    setDarkMode(false);
    setHighlightLinks(false);
    setLargeCursor(false);
    setReadableFont(false);
    setInvertColors(false);
    setGrayscaleMode(false);
    setSpeechReader(false);
    setReadingGuide(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <>
      {/* Horizontal Reading Guide Line */}
      {readingGuide && (
        <div
          className="reading-guide-ruler"
          style={{ top: `${guideTop}px` }}
          aria-hidden="true"
        />
      )}

      {/* Floating Widget Container */}
      <div className="accessibility-widget" aria-label="Widget de accesibilidad">
        {/* Toggle Button featuring official Accessibility Person SVG */}
        <button
          type="button"
          className={`accessibility-widget-toggle ${open ? "open" : ""}`}
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="accessibility-panel"
          title={t.accessibilityLabel}
        >
          <span className="accessibility-icon-badge" aria-hidden="true">
            {/* Official Universal Accessibility Symbol SVG */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="4" r="2" />
              <path d="M19 11h-6V7h-2v4H5v2h6v9h2v-9h6v-2z" />
              <circle cx="12" cy="12" r="10" strokeWidth="1.8" />
            </svg>
          </span>

          {activeCount > 0 && (
            <span className="accessibility-active-count" title={`${activeCount} opciones activas`}>
              {activeCount}
            </span>
          )}
        </button>

        {/* Accessibility Options Panel Modal */}
        {open && (
          <div
            className="accessibility-panel"
            id="accessibility-panel"
            role="dialog"
            aria-label={t.title}
          >
            {/* Header */}
            <div className="accessibility-panel-header">
              <h3 className="accessibility-panel-title">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="4" r="2" />
                  <path d="M19 11h-6V7h-2v4H5v2h6v9h2v-9h6v-2z" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                {t.title}
              </h3>
              <button
                type="button"
                className="accessibility-panel-close"
                onClick={() => setOpen(false)}
                aria-label={t.close}
              >
                ✕
              </button>
            </div>

            {/* Text Scale Resizer */}
            <div className="accessibility-text-resizer">
              <span className="accessibility-text-label">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 19V6.5A2.5 2.5 0 0 1 6.5 4H9M4 19h6M4 11h5" />
                  <path d="M14 19l4.5-11 4.5 11M16 15h6" />
                </svg>
                {t.textSizeLabel}
              </span>
              <div className="accessibility-text-controls">
                <button
                  type="button"
                  className="accessibility-btn-small"
                  onClick={() => adjustText(-0.1)}
                  disabled={textScale <= 0.8}
                  title={t.decreaseText}
                >
                  -
                </button>
                <span className="accessibility-scale-badge">
                  {Math.round(textScale * 100)}%
                </span>
                <button
                  type="button"
                  className="accessibility-btn-small"
                  onClick={() => adjustText(0.1)}
                  disabled={textScale >= 1.6}
                  title={t.increaseText}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Grid Buttons */}
            <div className="accessibility-grid">
              {/* High Contrast */}
              <button
                type="button"
                className={`accessibility-action-btn ${highContrast ? "active" : ""}`}
                onClick={() => setHighContrast((prev) => !prev)}
                aria-pressed={highContrast}
              >
                <div className="accessibility-btn-content">
                  <span className="accessibility-btn-icon" aria-hidden="true">
                    ◐
                  </span>
                  <span>{t.highContrast}</span>
                </div>
                <span className="accessibility-switch" />
              </button>

              {/* Dark Mode */}
              <button
                type="button"
                className={`accessibility-action-btn ${darkMode ? "active" : ""}`}
                onClick={() => setDarkMode((prev) => !prev)}
                aria-pressed={darkMode}
              >
                <div className="accessibility-btn-content">
                  <span className="accessibility-btn-icon" aria-hidden="true">
                    🌙
                  </span>
                  <span>{t.darkMode}</span>
                </div>
                <span className="accessibility-switch" />
              </button>

              {/* Highlight Links */}
              <button
                type="button"
                className={`accessibility-action-btn ${highlightLinks ? "active" : ""}`}
                onClick={() => setHighlightLinks((prev) => !prev)}
                aria-pressed={highlightLinks}
              >
                <div className="accessibility-btn-content">
                  <span className="accessibility-btn-icon" aria-hidden="true">
                    🔗
                  </span>
                  <span>{t.highlightLinks}</span>
                </div>
                <span className="accessibility-switch" />
              </button>

              {/* Large Cursor */}
              <button
                type="button"
                className={`accessibility-action-btn ${largeCursor ? "active" : ""}`}
                onClick={() => setLargeCursor((prev) => !prev)}
                aria-pressed={largeCursor}
              >
                <div className="accessibility-btn-content">
                  <span className="accessibility-btn-icon" aria-hidden="true">
                    ↖
                  </span>
                  <span>{t.largeCursor}</span>
                </div>
                <span className="accessibility-switch" />
              </button>

              {/* Readable Font */}
              <button
                type="button"
                className={`accessibility-action-btn ${readableFont ? "active" : ""}`}
                onClick={() => setReadableFont((prev) => !prev)}
                aria-pressed={readableFont}
              >
                <div className="accessibility-btn-content">
                  <span className="accessibility-btn-icon" aria-hidden="true">
                    📖
                  </span>
                  <span>{t.readableFont}</span>
                </div>
                <span className="accessibility-switch" />
              </button>

              {/* Invert Colors */}
              <button
                type="button"
                className={`accessibility-action-btn ${invertColors ? "active" : ""}`}
                onClick={() => setInvertColors((prev) => !prev)}
                aria-pressed={invertColors}
              >
                <div className="accessibility-btn-content">
                  <span className="accessibility-btn-icon" aria-hidden="true">
                    🔄
                  </span>
                  <span>{t.invertColors}</span>
                </div>
                <span className="accessibility-switch" />
              </button>

              {/* Grayscale Mode */}
              <button
                type="button"
                className={`accessibility-action-btn ${grayscaleMode ? "active" : ""}`}
                onClick={() => setGrayscaleMode((prev) => !prev)}
                aria-pressed={grayscaleMode}
              >
                <div className="accessibility-btn-content">
                  <span className="accessibility-btn-icon" aria-hidden="true">
                    🎨
                  </span>
                  <span>{t.grayscaleMode}</span>
                </div>
                <span className="accessibility-switch" />
              </button>

              {/* Text to Speech */}
              <button
                type="button"
                className={`accessibility-action-btn ${speechReader ? "active" : ""}`}
                onClick={() => setSpeechReader((prev) => !prev)}
                aria-pressed={speechReader}
              >
                <div className="accessibility-btn-content">
                  <span className="accessibility-btn-icon" aria-hidden="true">
                    🔊
                  </span>
                  <span>{t.speechReader}</span>
                </div>
                <span className="accessibility-switch" />
              </button>

              {/* Reading Guide */}
              <button
                type="button"
                className={`accessibility-action-btn ${readingGuide ? "active" : ""}`}
                onClick={() => setReadingGuide((prev) => !prev)}
                aria-pressed={readingGuide}
              >
                <div className="accessibility-btn-content">
                  <span className="accessibility-btn-icon" aria-hidden="true">
                    📏
                  </span>
                  <span>{t.readingGuide}</span>
                </div>
                <span className="accessibility-switch" />
              </button>
            </div>

            {/* Reset Button */}
            <button
              type="button"
              className="accessibility-reset-btn"
              onClick={resetAccessibility}
            >
              <span>↺</span>
              <span>{t.resetSettings}</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default AccessibilityWidget;

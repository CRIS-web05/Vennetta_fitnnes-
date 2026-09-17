import React, { useState, useEffect } from 'react';
import '../styles/assistant.css';
import assistantResponses from '../data/assistantResponses';

function AssistantWidget({ selectedLanguage }) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const langCode = selectedLanguage?.code || "es";
  const responses = assistantResponses[langCode] || assistantResponses.es;
  const ui = responses.ui || assistantResponses.es.ui;

  const [messages, setMessages] = useState([
    {
      from: 'assistant',
      text: responses.greeting
    },
  ]);

  // Actualizar el saludo inicial si cambia el idioma y no hay historial de mensajes
  useEffect(() => {
    const currentCode = selectedLanguage?.code || "es";
    const currentResp = assistantResponses[currentCode] || assistantResponses.es;

    setMessages((prev) => {
      if (prev.length <= 1) {
        return [{ from: 'assistant', text: currentResp.greeting }];
      }
      return prev;
    });
  }, [selectedLanguage]);

  // Función para cerrar y resetear/borrar automáticamente la conversación
  const handleClose = () => {
    setOpen(false);
    setInputValue('');
    const currentCode = selectedLanguage?.code || "es";
    const currentResp = assistantResponses[currentCode] || assistantResponses.es;
    setMessages([{ from: 'assistant', text: currentResp.greeting }]);
  };

  // Función para conmutar la visibilidad
  const handleToggle = () => {
    setOpen((prev) => {
      const nextState = !prev;
      if (!nextState) {
        // Al cerrarse el asistente, se borra automáticamente el historial y la entrada de texto
        setInputValue('');
        const currentCode = selectedLanguage?.code || "es";
        const currentResp = assistantResponses[currentCode] || assistantResponses.es;
        setMessages([{ from: 'assistant', text: currentResp.greeting }]);
      }
      return nextState;
    });
  };

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const userMessage = {
      from: 'user',
      text: userText
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    setTimeout(() => {
      const lower = userText.toLowerCase();
      const currentLanguage = selectedLanguage?.code || "es";
      const currentResponses = assistantResponses[currentLanguage] || assistantResponses.es;

      let reply = currentResponses.unknown;

      // SALUDO
      if (
        lower.includes('hola') ||
        lower.includes('hello') ||
        lower.includes('hi') ||
        lower.includes('hey') ||
        lower.includes('bonjour') ||
        lower.includes('hallo') ||
        lower.includes('olá') ||
        lower.includes('ciao') ||
        lower.includes('privet') ||
        lower.includes('marhaba') ||
        lower.includes('namaste')
      ) {
        reply = currentResponses.greeting;
      }
      // UBICACIÓN
      else if (
        currentResponses.keywords?.location?.some(word =>
          lower.includes(word.toLowerCase())
        )
      ) {
        reply = currentResponses.location;
      }
      // TELÉFONO / CONTACTO
      else if (
        currentResponses.keywords?.phone?.some(word =>
          lower.includes(word.toLowerCase())
        )
      ) {
        reply = currentResponses.phone;
      }
      // MEMBRESÍAS / PLANES
      else if (
        currentResponses.keywords?.memberships?.some(word =>
          lower.includes(word.toLowerCase())
        )
      ) {
        reply = currentResponses.memberships;
      }
      // HORARIOS
      else if (
        currentResponses.keywords?.schedule?.some(word =>
          lower.includes(word.toLowerCase())
        )
      ) {
        reply = currentResponses.schedule;
      }
      // SERVICIOS
      else if (
        currentResponses.keywords?.services?.some(word =>
          lower.includes(word.toLowerCase())
        )
      ) {
        reply = currentResponses.services;
      }
      // CONTRASEÑA
      else if (
        currentResponses.keywords?.password?.some(word =>
          lower.includes(word.toLowerCase())
        )
      ) {
        reply = currentResponses.password;
      }
      // ACCESIBILIDAD
      else if (
        lower.includes('accesibilidad') ||
        lower.includes('accessibility') ||
        lower.includes('contraste') ||
        lower.includes('texto')
      ) {
        reply = currentResponses.accessibility || currentResponses.unknown;
      }

      setMessages((prev) => [
        ...prev,
        {
          from: 'assistant',
          text: reply
        }
      ]);
    }, 400);
  };

  return (
    <div className="assistant-widget">
      <button
        type="button"
        className="assistant-toggle"
        onClick={handleToggle}
        aria-expanded={open}
        aria-controls="assistant-panel"
        aria-label={ui.label}
      >
        <span className="assistant-icon">🤖</span>
        <span className="assistant-label">{ui.label}</span>
      </button>

      {open && (
        <div
          className="assistant-panel"
          id="assistant-panel"
          role="dialog"
          aria-label={ui.title}
        >
          <div className="assistant-header">
            <h3>{ui.title}</h3>
            <button
              type="button"
              className="assistant-close"
              onClick={handleClose}
              aria-label={ui.close}
            >
              ×
            </button>
          </div>

          <div className="assistant-chat">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`assistant-message ${message.from}`}
              >
                <span>{message.text}</span>
              </div>
            ))}
          </div>

          <div className="assistant-input-row">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={ui.placeholder}
              aria-label={ui.placeholder}
            />

            <button
              type="button"
              className="assistant-send-btn"
              onClick={sendMessage}
            >
              {ui.send}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssistantWidget;
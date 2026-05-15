import { useState, useEffect, useRef, useCallback } from "react";
import { LuX, LuCheck } from "react-icons/lu";
import "./AutocompleteInput.css";

/**
 * AutocompleteInput — inline suggestion (sin dropdown)
 *
 * El usuario escribe y el input completa el texto automáticamente
 * con la primera coincidencia del backend. La parte sugerida queda
 * seleccionada; Tab o → la acepta, cualquier otra tecla la reemplaza.
 *
 * Props:
 * @param {string}   label        — etiqueta visible sobre el input
 * @param {string}   placeholder  — texto de ayuda cuando está vacío
 * @param {string}   endpoint     — URL del endpoint, ej: "/api/conductores/autocompletar"
 * @param {function} onSelect     — callback al confirmar: (item) => void
 * @param {function} labelKey     — extrae el texto a mostrar de un item
 * @param {any}      [value]      — ítem seleccionado (modo controlado)
 * @param {number}   [debounceMs] — ms de espera antes de consultar (default: 250)
 * @param {string}   [className]  — clases extra para el wrapper
 */

function StatusIcon({ isConfirmed, onClear }) {
  if (!isConfirmed) return null;
  return (
    <span className="ac-icon ac-icon--confirmed">
      <LuCheck />
      <button
        type="button"
        className="ac-clear-btn"
        onClick={onClear}
        title="Limpiar"
        tabIndex={-1}
      >
        <LuX />
      </button>
    </span>
  );
}

export default function AutocompleteInput({
  label,
  placeholder = "Escribe para buscar...",
  endpoint,
  onSelect,
  labelKey,
  value = null,
  debounceMs = 250,
  className = "",
}) {
  const [inputText, setInputText]   = useState(() => (value ? labelKey(value) : ""));
  const [confirmed, setConfirmed]   = useState(value);
  const [suggestion, setSuggestion] = useState(null);

  const inputRef    = useRef(null);
  const debounceRef = useRef(null);

  // Sincronizar prop value externa sin useEffect
  const prevValueRef = useRef(value);
  if (prevValueRef.current !== value) {
    prevValueRef.current = value;
    setConfirmed(value);
    setInputText(value ? labelKey(value) : "");
    setSuggestion(null);
  }

  // Aplicar la selección inline cuando llega una nueva sugerencia
  useEffect(() => {
    if (!suggestion || !inputRef.current) return;
    const input = inputRef.current;
    input.value = suggestion.text;
    input.setSelectionRange(inputText.length, suggestion.text.length);
  }, [suggestion, inputText]);

  // Pedir la primera coincidencia al backend
  const fetchSuggestion = useCallback(
    (query) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!query.trim()) {
        setSuggestion(null);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        try {
          const res  = await fetch(`${endpoint}?q=${encodeURIComponent(query)}`);
          const data = await res.json();

          if (data.length > 0) {
            const fullText = labelKey(data[0]);
            if (fullText.toLowerCase().startsWith(query.toLowerCase())) {
              setSuggestion({ item: data[0], text: fullText });
            } else {
              setSuggestion(null);
            }
          } else {
            setSuggestion(null);
          }
        } catch (err) {
          console.error("Error en autocompletado:", err);
          setSuggestion(null);
        }
      }, debounceMs);
    },
    [endpoint, debounceMs, labelKey]
  );

  const confirmSuggestion = useCallback(() => {
    if (!suggestion) return;
    setInputText(suggestion.text);
    setConfirmed(suggestion.item);
    setSuggestion(null);
    onSelect(suggestion.item);
  }, [suggestion, onSelect]);

  const handleChange = (e) => {
    const val = e.target.value;
    setInputText(val);
    setConfirmed(null);
    setSuggestion(null);
    onSelect(null);
    fetchSuggestion(val);
  };

  const handleKeyDown = (e) => {
    if (!suggestion) return;
    if (e.key === "Tab" || e.key === "ArrowRight") {
      e.preventDefault();
      confirmSuggestion();
    }
    if (e.key === "Escape") {
      setSuggestion(null);
    }
  };

  const handleClear = () => {
    setInputText("");
    setConfirmed(null);
    setSuggestion(null);
    onSelect(null);
    inputRef.current?.focus();
  };

  return (
    <div className={`ac-wrapper ${className}`}>
      {label && <label className="form-label">{label}</label>}

      <div className="ac-input-container">
        <input
          ref={inputRef}
          type="text"
          className={`ac-input ${confirmed ? "ac-input--confirmed" : ""}`}
          placeholder={placeholder}
          value={suggestion ? suggestion.text : inputText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
        />
        <StatusIcon isConfirmed={!!confirmed} onClear={handleClear} />
      </div>

      {suggestion && (
        <p className="ac-hint">
          Presiona <kbd>Tab</kbd> o <kbd>→</kbd> para aceptar
        </p>
      )}
    </div>
  );
}
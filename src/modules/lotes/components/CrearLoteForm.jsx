import { useState, useEffect, useRef } from "react";
import {
  LuPackagePlus, LuPlus, LuMinus, LuMail,
  LuHash, LuUser, LuFileText, LuTriangleAlert, LuCheck, LuX, LuSettings,
  LuSquareCheck, LuSquare, LuLink, LuLock
} from "react-icons/lu";
import { FileUpload } from "../../../components/ui/FileUpload";
import { FormSection } from "../../../components/ui/FormSection";
import { FormField } from "../../../components/ui/FormField";
import { EmailPreview } from "./EmailPreview";
import AutocompleteInput from "../../../components/ui/AutocompleteInput";
import "./CrearLoteForm.css";

let nextGuiaId = 1;

const CONFIG_FIELDS = [
  { key: "campoLinea", label: "Línea naviera" },
  { key: "campoEta", label: "ETA" },
  { key: "campoBooking", label: "Documento / Booking" },
  { key: "campoTipoContenedor", label: "Tipo de Contenedor" },
  { key: "campoSello", label: "Sello" },
  { key: "campoDepot", label: "Depot" },
  { key: "campoPuerto", label: "Puerto" },
  { key: "campoTipoTransaccion", label: "Tipo de Transacción" },
  { key: "campoLinkRastreo", label: "URL de rastreo" },
  { key: "campoPwdRastreo", label: "Contraseña de rastreo" },
];

const INITIAL_FIELDS = {
  campoLinea: true,
  campoEta: true,
  campoBooking: true,
  campoTipoContenedor: true,
  campoSello: true,
  campoDepot: true,
  campoPuerto: true,
  campoTipoTransaccion: true,
  campoLinkRastreo: true,
  campoPwdRastreo: true,
};

const guiaVacia = () => ({
  id: nextGuiaId++,
  linea:           null,   // { idLinea, nombreLinea }
  eta:             '',
  booking:         '',
  conductor:       null,   // { idConductor, nombreConductor, apellidoConductor }
  vehiculo:        null,   // { idVehiculo, placa, linkRastreo, pwdRastreo }
  contenedor:      '',
  tipoContenedor:  null,   // { idTipoContenedor, tipo }
  sello:           '',
  depot:           '',
  puerto:          null,   // { idPuerto, nombre }
  tipoTransaccion: null,   // { idTransaccion, descripcion }
  archivo:         null,
  eir:             null,
  observaciones:   '',
});

export default function CrearLoteForm() {
  const [remitente, setRemitente]             = useState(""); // Text typed in input
  const [selectedCliente, setSelectedCliente] = useState(null); // Full client object when selected
  const [tituloCorreo, setTituloCorreo]       = useState("");
  const [mensaje, setMensaje]                 = useState("");
  const [guias, setGuias]                     = useState([guiaVacia()]);

  // Autocomplete Suggestions State
  const [clientSuggestions, setClientSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions]     = useState(false);
  const [isClientWarningVisible, setIsClientWarningVisible] = useState(false);
  const dropdownRef = useRef(null);

  // Express Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalNombre, setModalNombre] = useState("");
  const [modalCorreos, setModalCorreos] = useState([{ nombreDestinatario: "", correoDestinatario: "" }]);
  const [modalFieldsConfig, setModalFieldsConfig] = useState(INITIAL_FIELDS);

  // Fetch Suggestions when client text changes
  useEffect(() => {
    if (selectedCliente) {
      setIsClientWarningVisible(false);
      return;
    }

    if (!remitente.trim()) {
      setClientSuggestions([]);
      setIsClientWarningVisible(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`/api/clientes/autocompletar?q=${encodeURIComponent(remitente)}`);
        const data = await res.json();
        setClientSuggestions(data);

        // If no suggestions found, warn about unregistered client
        if (data.length === 0) {
          setIsClientWarningVisible(true);
        } else {
          // Check if there is an exact match (case insensitive)
          const exactMatch = data.find(
            c => c.nombreCliente.toLowerCase() === remitente.trim().toLowerCase()
          );
          if (exactMatch) {
            setSelectedCliente(exactMatch);
            setIsClientWarningVisible(false);
          } else {
            setIsClientWarningVisible(true);
          }
        }
      } catch (err) {
        console.error("Error fetching client suggestions:", err);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [remitente, selectedCliente]);

  // Handle outside click to close suggestions dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCliente = (cliente) => {
    setSelectedCliente(cliente);
    setRemitente(cliente.nombreCliente);
    setClientSuggestions([]);
    setShowSuggestions(false);
    setIsClientWarningVisible(false);
  };

  const handleClearCliente = () => {
    setSelectedCliente(null);
    setRemitente("");
    setClientSuggestions([]);
    setIsClientWarningVisible(false);
  };

  const openExpressModal = () => {
    setModalNombre(remitente);
    setModalCorreos([{ nombreDestinatario: "", correoDestinatario: "" }]);
    setModalFieldsConfig(INITIAL_FIELDS);
    setIsModalOpen(true);
  };

  const handleSaveExpressClient = async (e) => {
    e.preventDefault();
    if (!modalNombre.trim()) return;

    const filteredCorreos = modalCorreos.filter(
      c => c.nombreDestinatario.trim() && c.correoDestinatario.trim()
    );

    const payload = {
      nombreCliente: modalNombre.trim(),
      ...modalFieldsConfig,
      correos: filteredCorreos
    };

    try {
      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Error creating client");
      const savedClient = await res.json();

      // Retrieve full client details to select it
      const detailsRes = await fetch(`/api/clientes/autocompletar?q=${encodeURIComponent(savedClient.nombreCliente)}`);
      const detailsData = await detailsRes.json();
      if (detailsData.length > 0) {
        handleSelectCliente(detailsData[0]);
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error al registrar el cliente express");
    }
  };

  const handleCheckboxToggle = (key) => {
    setModalFieldsConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectAllToggle = () => {
    const allChecked = Object.values(modalFieldsConfig).every(v => v === true);
    const updated = {};
    CONFIG_FIELDS.forEach(f => { updated[f.key] = !allChecked; });
    setModalFieldsConfig(updated);
  };

  const handleAddCorreoRow = () => {
    setModalCorreos([...modalCorreos, { nombreDestinatario: "", correoDestinatario: "" }]);
  };

  const handleRemoveCorreoRow = (index) => {
    if (modalCorreos.length === 1) {
      setModalCorreos([{ nombreDestinatario: "", correoDestinatario: "" }]);
    } else {
      setModalCorreos(modalCorreos.filter((_, i) => i !== index));
    }
  };

  const handleCorreoRowChange = (index, field, value) => {
    const updated = [...modalCorreos];
    updated[index][field] = value;
    setModalCorreos(updated);
  };

  const agregarGuia = () => setGuias((prev) => [...prev, guiaVacia()]);

  const removerGuia = (id) =>
    setGuias((prev) => (prev.length > 1 ? prev.filter((g) => g.id !== id) : prev));

  const actualizarGuia = (id, campo, valor) =>
    setGuias((prev) =>
      prev.map((g) => (g.id === id ? { ...g, [campo]: valor } : g))
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataLote = {
      remitente,
      clienteId: selectedCliente?.idCliente,
      tituloCorreo,
      mensaje,
      guias: guias.map(({ id: _id, linea, conductor, vehiculo, tipoContenedor, puerto, tipoTransaccion, ...rest }) => ({
        ...rest,
        Linea_idLinea:                   linea?.idLinea,
        Conductor_idConductor:           conductor?.idConductor,
        Vehiculo_idVehiculo:             vehiculo?.idVehiculo,
        TipoContenedor_idTipoContenedor: tipoContenedor?.idTipoContenedor,
        Puerto_idPuerto:                 puerto?.idPuerto,
        TipoTransaccion_idTransaccion:   tipoTransaccion?.idTransaccion,
      })),
    };
    console.log("Generando Lote:", dataLote);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="clf-layout">

        {/* ── Bloque superior: previsualización ── */}
        <div className="clf-preview-block">
          <EmailPreview
            remitente={remitente}
            tituloCorreo={tituloCorreo}
            mensaje={mensaje}
            guias={guias}
            cliente={selectedCliente}
          />
        </div>

        {/* ── Formulario de detalles ── */}
        <div className="clf-form-col">
          <div className="clf-form">

            <FormSection icon={LuMail} title="Información del correo">
              <div className="clf-grid-2">
                
                {/* Cliente / Remitente Autocomplete Search */}
                <div className="client-autocomplete-wrapper" ref={dropdownRef}>
                  <FormField
                    label="Cliente (Remitente)"
                    icon={LuUser}
                    placeholder="Escribe para buscar cliente..."
                    value={remitente}
                    onChange={(e) => {
                      setRemitente(e.target.value);
                      setSelectedCliente(null);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                  />

                  {/* Suggestions List */}
                  {showSuggestions && clientSuggestions.length > 0 && (
                    <ul className="client-suggestions-list">
                      {clientSuggestions.map((c) => (
                        <li 
                          key={c.idCliente}
                          className="client-suggestion-item"
                          onClick={() => handleSelectCliente(c)}
                        >
                          {c.nombreCliente}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Unregistered Client Alert */}
                  {isClientWarningVisible && !selectedCliente && (
                    <div className="client-warning-box">
                      <div className="client-warning-message">
                        <LuTriangleAlert />
                        <span>Este cliente no está registrado.</span>
                      </div>
                      <button 
                        type="button" 
                        className="client-register-link" 
                        onClick={openExpressModal}
                      >
                        Registrar cliente
                      </button>
                    </div>
                  )}

                  {/* Selected Badge */}
                  {selectedCliente && (
                    <div className="client-success-badge">
                      <LuCheck />
                      <span>Registrado y Configurado</span>
                      <button 
                        type="button" 
                        className="client-clear-btn" 
                        onClick={handleClearCliente}
                        title="Limpiar cliente"
                      >
                        <LuX />
                      </button>
                    </div>
                  )}
                </div>

                <FormField
                  label="Título del correo"
                  icon={LuMail}
                  placeholder="Ej: Notificación de nuevo lote #001"
                  value={tituloCorreo}
                  onChange={(e) => setTituloCorreo(e.target.value)}
                />
              </div>
              <FormField
                label="Mensaje"
                icon={LuFileText}
                placeholder="Escribe el mensaje que se enviará junto al lote..."
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                multiline
              />
            </FormSection>

            {guias.map((guia, index) => {
              // Read checkboxes flags from selectedCliente
              // If no client is selected, show all fields (fallback default)
              const showLinea           = !selectedCliente || selectedCliente.campoLinea;
              const showEta             = !selectedCliente || selectedCliente.campoEta;
              const showBooking         = !selectedCliente || selectedCliente.campoBooking;
              const showTipoContenedor  = !selectedCliente || selectedCliente.campoTipoContenedor;
              const showSello           = !selectedCliente || selectedCliente.campoSello;
              const showDepot           = !selectedCliente || selectedCliente.campoDepot;
              const showPuerto          = !selectedCliente || selectedCliente.campoPuerto;
              const showTipoTransaccion = !selectedCliente || selectedCliente.campoTipoTransaccion;
              const showLinkRastreo     = !selectedCliente || selectedCliente.campoLinkRastreo;
              const showPwdRastreo      = !selectedCliente || selectedCliente.campoPwdRastreo;

              return (
                <FormSection
                  key={guia.id}
                  icon={LuPackagePlus}
                  title={`Guía ${index + 1}`}
                  accent
                  actions={
                    guias.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removerGuia(guia.id)}
                        className="clf-remove-btn"
                        aria-label="Eliminar guía"
                      >
                        <LuMinus />
                      </button>
                    )
                  }
                >
                  <div className="clf-grid-2">
                    {showLinea && (
                      <AutocompleteInput
                        label="Línea naviera"
                        placeholder="Buscar línea naviera..."
                        endpoint="/api/lineas/autocompletar"
                        labelKey={(item) => item.nombreLinea}
                        sublabelKey={(item) => `ID: ${item.idLinea}`}
                        onSelect={(item) => actualizarGuia(guia.id, "linea", item)}
                        value={guia.linea}
                      />
                    )}
                    {showEta && (
                      <FormField
                        label="ETA (Llegada estimada)"
                        type="datetime-local"
                        value={guia.eta}
                        onChange={(e) => actualizarGuia(guia.id, "eta", e.target.value)}
                      />
                    )}
                  </div>

                  <div className="clf-grid-3">
                    {showBooking && (
                      <FormField
                        label="Booking"
                        icon={LuHash}
                        value={guia.booking}
                        onChange={(e) => actualizarGuia(guia.id, "booking", e.target.value)}
                      />
                    )}
                    <AutocompleteInput
                      label="Conductor"
                      placeholder="Buscar por nombre..."
                      endpoint="/api/conductores/autocompletar"
                      labelKey={(item) => `${item.nombreConductor} ${item.apellidoConductor}`}
                      sublabelKey={(item) => `ID: ${item.idConductor}`}
                      onSelect={(item) => actualizarGuia(guia.id, "conductor", item)}
                      value={guia.conductor}
                    />
                    <AutocompleteInput
                      label="Placa"
                      placeholder="Buscar vehículo por placa..."
                      endpoint="/api/vehiculos/autocompletar"
                      labelKey={(item) => item.placa}
                      onSelect={(item) => actualizarGuia(guia.id, "vehiculo", item)}
                      value={guia.vehiculo}
                    />
                  </div>

                  {/* Vehicle tracking read-only inputs (link and password) */}
                  {(showLinkRastreo || showPwdRastreo) && (
                    <div className="clf-grid-2">
                      {showLinkRastreo && (
                        <FormField
                          label="Link de Rastreo (Vehículo)"
                          icon={LuLink}
                          value={guia.vehiculo?.linkRastreo || ""}
                          placeholder={guia.vehiculo ? "Sin link configurado para esta placa" : "Selecciona una placa..."}
                          className="readonly-field"
                          onChange={() => {}}
                          disabled
                        />
                      )}
                      {showPwdRastreo && (
                        <FormField
                          label="Clave de Rastreo (Vehículo)"
                          icon={LuLock}
                          value={guia.vehiculo?.pwdRastreo || ""}
                          placeholder={guia.vehiculo ? "Sin clave configurada para esta placa" : "Selecciona una placa..."}
                          className="readonly-field"
                          onChange={() => {}}
                          disabled
                        />
                      )}
                    </div>
                  )}

                  <div className="clf-grid-4">
                    <FormField
                      label="Contenedor"
                      value={guia.contenedor}
                      onChange={(e) => actualizarGuia(guia.id, "contenedor", e.target.value)}
                    />
                    {showTipoContenedor && (
                      <AutocompleteInput
                        label="Tipo de Contenedor"
                        placeholder="Buscar tipo..."
                        endpoint="/api/tipos-contenedor/autocompletar"
                        labelKey={(item) => item.tipo}
                        sublabelKey={(item) => `ID: ${item.idTipoContenedor}`}
                        onSelect={(item) => actualizarGuia(guia.id, "tipoContenedor", item)}
                        value={guia.tipoContenedor}
                      />
                    )}
                    {showSello && (
                      <FormField
                        label="Sello"
                        value={guia.sello}
                        onChange={(e) => actualizarGuia(guia.id, "sello", e.target.value)}
                      />
                    )}
                    {showDepot && (
                      <FormField
                        label="Depot"
                        value={guia.depot}
                        onChange={(e) => actualizarGuia(guia.id, "depot", e.target.value)}
                      />
                    )}
                    {showPuerto && (
                      <AutocompleteInput
                        label="Puerto"
                        placeholder="Buscar puerto..."
                        endpoint="/api/puertos/autocompletar"
                        labelKey={(item) => item.nombre}
                        sublabelKey={(item) => `ID: ${item.idPuerto}`}
                        onSelect={(item) => actualizarGuia(guia.id, "puerto", item)}
                        value={guia.puerto}
                      />
                    )}
                    {showTipoTransaccion && (
                      <AutocompleteInput
                        label="Tipo de Transacción"
                        placeholder="Buscar tipo..."
                        endpoint="/api/tipos-transaccion/autocompletar"
                        labelKey={(item) => item.descripcion}
                        sublabelKey={(item) => `ID: ${item.idTransaccion}`}
                        onSelect={(item) => actualizarGuia(guia.id, "tipoTransaccion", item)}
                        value={guia.tipoTransaccion}
                      />
                    )}
                  </div>

                  <FileUpload
                    label="Guía de Remisión"
                    required={true}
                    onFileChange={(file) => actualizarGuia(guia.id, "archivo", file)}
                    file={guia.archivo}
                    acceptedExtensions={["pdf", "jpg", "jpeg", "png"]}
                  />

                  <FileUpload
                    label="EIR (Equipment Interchange Receipt)"
                    onFileChange={(file) => actualizarGuia(guia.id, "eir", file)}
                    file={guia.eir}
                    acceptedExtensions={["pdf"]}
                  />

                  <FormField
                    label="Observaciones"
                    placeholder="Detalles adicionales de esta guía..."
                    value={guia.observaciones}
                    onChange={(e) => actualizarGuia(guia.id, "observaciones", e.target.value)}
                    multiline
                  />
                </FormSection>
              );
            })}

            <button type="button" onClick={agregarGuia} className="clf-add-btn">
              <LuPlus /> Agregar otra guía
            </button>

          </div>
        </div>

      </form>

      {/* Express Client Creation Modal */}
      {isModalOpen && (
        <div className="clf-modal-overlay">
          <div className="clf-modal-content">
            <div className="clf-modal-header">
              <h2>Registrar Cliente Nuevo</h2>
              <button 
                type="button" 
                className="clf-modal-close-btn" 
                onClick={() => setIsModalOpen(false)}
              >
                <LuX />
              </button>
            </div>
            
            <form onSubmit={handleSaveExpressClient}>
              <div className="clf-modal-body">
                {/* Client Name */}
                <div className="clf-form-group">
                  <label className="clf-label">
                    <LuUser /> Nombre del Cliente
                  </label>
                  <input
                    type="text"
                    required
                    className="clf-input"
                    placeholder="Ej: Importadora García S.A."
                    value={modalNombre}
                    onChange={(e) => setModalNombre(e.target.value)}
                  />
                </div>

                {/* Emails Row Builder */}
                <div className="clf-form-group">
                  <label className="clf-label">
                    <LuMail /> Correos de Destinatarios
                  </label>
                  <div className="clf-email-builder">
                    {modalCorreos.map((row, index) => (
                      <div className="clf-email-line" key={index}>
                        <input
                          type="text"
                          required
                          className="clf-input"
                          placeholder="Nombre Destinatario"
                          value={row.nombreDestinatario}
                          onChange={(e) => handleCorreoRowChange(index, "nombreDestinatario", e.target.value)}
                        />
                        <input
                          type="email"
                          required
                          className="clf-input"
                          placeholder="correo@ejemplo.com"
                          value={row.correoDestinatario}
                          onChange={(e) => handleCorreoRowChange(index, "correoDestinatario", e.target.value)}
                        />
                        <button 
                          type="button" 
                          className="clf-btn-delete-row"
                          onClick={() => handleRemoveCorreoRow(index)}
                          title="Remover destinatario"
                        >
                          <LuTrash2 />
                        </button>
                      </div>
                    ))}
                    
                    <button 
                      type="button" 
                      className="clf-btn-add-row" 
                      onClick={handleAddCorreoRow}
                    >
                      <LuPlus /> Agregar Destinatario
                    </button>
                  </div>
                </div>

                {/* Fields Configuration Checkbox Panel */}
                <div className="clf-form-group">
                  <label className="clf-label">
                    <LuSettings /> Campos Habilitados en Guías
                  </label>
                  
                  <div className="clf-checkbox-panel">
                    <div className="clf-checkbox-panel-header">
                      <span>Selecciona los datos requeridos para este cliente:</span>
                      <button 
                        type="button" 
                        className="clf-btn-select-all"
                        onClick={handleSelectAllToggle}
                      >
                        {Object.values(modalFieldsConfig).every(v => v === true) 
                          ? "Desseleccionar todos" 
                          : "Seleccionar todos"}
                      </button>
                    </div>

                    <div className="clf-checkbox-grid">
                      {CONFIG_FIELDS.map(f => {
                        const isChecked = modalFieldsConfig[f.key];
                        return (
                          <div 
                            key={f.key} 
                            className="clf-checkbox-label"
                            onClick={() => handleCheckboxToggle(f.key)}
                          >
                            <span className={`clf-checkbox-icon ${isChecked ? "checked" : ""}`}>
                              {isChecked ? <LuSquareCheck /> : <LuSquare />}
                            </span>
                            <span>{f.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="clf-modal-footer">
                <button 
                  type="button" 
                  className="clf-btn-secondary" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="clf-btn-primary">
                  Registrar y Seleccionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
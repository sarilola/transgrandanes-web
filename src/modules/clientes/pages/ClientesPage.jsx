// src/modules/clientes/pages/ClientesPage.jsx
import { useState, useEffect } from "react";
import { 
  LuUser, LuMail, LuPlus, LuTrash2, LuPencil, 
  LuSearch, LuX, LuSettings, LuUsers, 
  LuSquareCheck, LuSquare, LuCheck, LuTriangleAlert
} from "react-icons/lu";
import { Button1 } from "../../../components/ui/Button1";
import "./ClientesPage.css";

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

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Form State
  const [clienteId, setClienteId] = useState(null); // null when creating
  const [nombreCliente, setNombreCliente] = useState("");
  const [correos, setCorreos] = useState([{ nombreDestinatario: "", correoDestinatario: "" }]);
  const [fieldsConfig, setFieldsConfig] = useState(INITIAL_FIELDS);

  useEffect(() => {
    fetchClientes();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/clientes");
      if (!res.ok) throw new Error("Error en respuesta");
      const data = await res.json();
      setClientes(data);
    } catch (err) {
      console.error(err);
      showToast("Error al obtener los clientes", "error");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setClienteId(null);
    setNombreCliente("");
    setCorreos([{ nombreDestinatario: "", correoDestinatario: "" }]);
    setFieldsConfig(INITIAL_FIELDS);
    setIsModalOpen(true);
  };

  const openEditModal = (cliente) => {
    setClienteId(cliente.idCliente);
    setNombreCliente(cliente.nombreCliente);
    setCorreos(
      cliente.correos.length > 0 
        ? cliente.correos.map(c => ({ nombreDestinatario: c.nombreDestinatario, correoDestinatario: c.correoDestinatario }))
        : [{ nombreDestinatario: "", correoDestinatario: "" }]
    );
    setFieldsConfig({
      campoLinea: !!cliente.campoLinea,
      campoEta: !!cliente.campoEta,
      campoBooking: !!cliente.campoBooking,
      campoTipoContenedor: !!cliente.campoTipoContenedor,
      campoSello: !!cliente.campoSello,
      campoDepot: !!cliente.campoDepot,
      campoPuerto: !!cliente.campoPuerto,
      campoTipoTransaccion: !!cliente.campoTipoTransaccion,
      campoLinkRastreo: !!cliente.campoLinkRastreo,
      campoPwdRastreo: !!cliente.campoPwdRastreo,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!nombreCliente.trim()) {
      showToast("El nombre del cliente es obligatorio", "error");
      return;
    }

    // Filter out empty email entries
    const filteredCorreos = correos.filter(
      c => c.nombreDestinatario.trim() && c.correoDestinatario.trim()
    );

    const payload = {
      nombreCliente: nombreCliente.trim(),
      ...fieldsConfig,
      correos: filteredCorreos,
    };

    try {
      const url = clienteId ? `/api/clientes/${clienteId}` : "/api/clientes";
      const method = clienteId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error guardando cliente");

      showToast(
        clienteId ? "Cliente actualizado exitosamente" : "Cliente creado exitosamente"
      );
      setIsModalOpen(false);
      fetchClientes();
    } catch (err) {
      console.error(err);
      showToast("Ocurrió un error al guardar el cliente", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este cliente? Se borrarán también sus correos asociados.")) {
      return;
    }

    try {
      const res = await fetch(`/api/clientes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error eliminando cliente");

      showToast("Cliente eliminado correctamente");
      fetchClientes();
    } catch (err) {
      console.error(err);
      showToast("Ocurrió un error al eliminar el cliente", "error");
    }
  };

  const handleAddCorreoRow = () => {
    setCorreos([...correos, { nombreDestinatario: "", correoDestinatario: "" }]);
  };

  const handleRemoveCorreoRow = (index) => {
    if (correos.length === 1) {
      setCorreos([{ nombreDestinatario: "", correoDestinatario: "" }]);
    } else {
      setCorreos(correos.filter((_, i) => i !== index));
    }
  };

  const handleCorreoRowChange = (index, field, value) => {
    const updated = [...correos];
    updated[index][field] = value;
    setCorreos(updated);
  };

  const handleCheckboxToggle = (key) => {
    setFieldsConfig(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelectAllToggle = () => {
    const allChecked = Object.values(fieldsConfig).every(v => v === true);
    const updated = {};
    CONFIG_FIELDS.forEach(f => {
      updated[f.key] = !allChecked;
    });
    setFieldsConfig(updated);
  };

  const filteredClientes = clientes.filter(c => 
    c.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="clientes-container">
      {/* Toast Notification */}
      {toast && (
        <div className={`alert-toast ${toast.type === "error" ? "error" : ""}`}>
          {toast.type === "error" ? <LuTriangleAlert /> : <LuCheck />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="clientes-header">
        <div className="clientes-title-section">
          <h1>Gestión de Clientes</h1>
          <p className="clientes-subtitle">Configura los destinatarios de correo y campos visibles por cliente.</p>
        </div>
        <Button1 label="Agregar Cliente" onClick={openCreateModal} />
      </div>

      {/* Search bar */}
      <div className="clientes-search-bar">
        <div className="search-input-wrapper">
          <LuSearch />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre de cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="text-center p-8">
          <p className="animate-pulse text-gray-400">Cargando listado de clientes...</p>
        </div>
      ) : filteredClientes.length === 0 ? (
        <div className="clientes-empty-state">
          <LuUsers className="clientes-empty-icon" />
          <h3 className="clientes-empty-title">No hay clientes registrados</h3>
          <p>
            {searchTerm 
              ? "No se encontraron clientes que coincidan con la búsqueda." 
              : "Registra los clientes de transporte para configurar sus correos y campos."}
          </p>
          {!searchTerm && (
            <Button1 label="Registrar Primer Cliente" onClick={openCreateModal} />
          )}
        </div>
      ) : (
        <div className="clientes-grid">
          {filteredClientes.map((cliente) => {
            const activeFieldsCount = CONFIG_FIELDS.filter(f => cliente[f.key]).length;

            return (
              <div className="cliente-card" key={cliente.idCliente}>
                <div>
                  <div className="cliente-card-header">
                    <div className="cliente-name-group">
                      <div className="cliente-avatar">
                        {cliente.nombreCliente.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="cliente-name">{cliente.nombreCliente}</span>
                    </div>
                    <div className="cliente-actions">
                      <button 
                        onClick={() => openEditModal(cliente)} 
                        className="btn-icon-action" 
                        title="Editar cliente"
                      >
                        <LuPencil />
                      </button>
                      <button 
                        onClick={() => handleDelete(cliente.idCliente)} 
                        className="btn-icon-action btn-delete" 
                        title="Eliminar cliente"
                      >
                        <LuTrash2 />
                      </button>
                    </div>
                  </div>

                  {/* Section: Emails */}
                  <div className="card-section">
                    <h4 className="card-section-title">
                      <LuMail /> Destinatarios ({cliente.correos.length})
                    </h4>
                    {cliente.correos.length === 0 ? (
                      <p className="no-emails">Sin destinatarios configurados</p>
                    ) : (
                      <div className="emails-list">
                        {cliente.correos.map((correo) => (
                          <div className="email-item" key={correo.idCorreo}>
                            <span className="email-dest">{correo.nombreDestinatario}</span>
                            <span className="email-val">{correo.correoDestinatario}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Section: Config */}
                  <div className="card-section">
                    <h4 className="card-section-title">
                      <LuSettings /> Campos Activos ({activeFieldsCount}/{CONFIG_FIELDS.length})
                    </h4>
                    <div className="fields-summary">
                      {CONFIG_FIELDS.map(f => (
                        <span 
                          key={f.key} 
                          className={`field-badge ${cliente[f.key] ? "active" : ""}`}
                        >
                          {f.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal overlay */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{clienteId ? "Editar Cliente" : "Agregar Nuevo Cliente"}</h2>
              <button className="modal-close-btn" onClick={() => setIsOpenModal(false)}>
                <LuX onClick={() => setIsModalOpen(false)} />
              </button>
            </div>
            
            <form onSubmit={handleSave}>
              <div className="modal-body">
                {/* Cliente Name */}
                <div className="form-group">
                  <label className="form-label-custom">
                    <LuUser /> Nombre del Cliente
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input-custom"
                    placeholder="Ej: Importadora García S.A."
                    value={nombreCliente}
                    onChange={(e) => setNombreCliente(e.target.value)}
                  />
                </div>

                {/* Emails Row Builder */}
                <div className="form-group">
                  <label className="form-label-custom">
                    <LuMail /> Correos de Notificación
                  </label>
                  <div className="email-row-builder">
                    {correos.map((row, index) => (
                      <div className="email-builder-line" key={index}>
                        <input
                          type="text"
                          required
                          className="form-input-custom"
                          placeholder="Nombre Destinatario"
                          value={row.nombreDestinatario}
                          onChange={(e) => handleCorreoRowChange(index, "nombreDestinatario", e.target.value)}
                        />
                        <input
                          type="email"
                          required
                          className="form-input-custom"
                          placeholder="correo@ejemplo.com"
                          value={row.correoDestinatario}
                          onChange={(e) => handleCorreoRowChange(index, "correoDestinatario", e.target.value)}
                        />
                        <button 
                          type="button" 
                          className="btn-delete-row"
                          onClick={() => handleRemoveCorreoRow(index)}
                          title="Remover destinatario"
                        >
                          <LuTrash2 />
                        </button>
                      </div>
                    ))}
                    
                    <button 
                      type="button" 
                      className="btn-add-row" 
                      onClick={handleAddCorreoRow}
                    >
                      <LuPlus /> Agregar Destinatario
                    </button>
                  </div>
                </div>

                {/* Fields Checkbox Panel */}
                <div className="form-group">
                  <label className="form-label-custom">
                    <LuSettings /> Campos Habilitados en Guías
                  </label>
                  
                  <div className="checkbox-panel">
                    <div className="checkbox-panel-header">
                      <span>Selecciona los datos requeridos para este cliente:</span>
                      <button 
                        type="button" 
                        className="btn-select-all"
                        onClick={handleSelectAllToggle}
                      >
                        {Object.values(fieldsConfig).every(v => v === true) 
                          ? "Desseleccionar todos" 
                          : "Seleccionar todos"}
                      </button>
                    </div>

                    <div className="checkbox-grid">
                      {CONFIG_FIELDS.map(f => {
                        const isChecked = fieldsConfig[f.key];
                        return (
                          <div 
                            key={f.key} 
                            className="checkbox-label-wrapper"
                            onClick={() => handleCheckboxToggle(f.key)}
                          >
                            <span className={`checkbox-custom-icon ${isChecked ? "checked" : ""}`}>
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

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {clienteId ? "Guardar Cambios" : "Agregar Cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

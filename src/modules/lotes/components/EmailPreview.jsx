import { LuMail, LuPackage, LuSend, LuLink, LuLock } from "react-icons/lu";
import "./EmailPreview.css";

const formatEta = (etaStr) => {
  if (!etaStr) return null;
  const d = new Date(etaStr);
  return d.toLocaleString("es-EC", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const EmailPreview = ({ remitente, tituloCorreo, mensaje, guias, cliente = null }) => {
  
  // Calculate missing fields to check if ready
  const isGuideComplete = (g) => {
    // Required fields
    if (!g.conductor || !g.vehiculo || !g.contenedor || !g.contenedor.trim() || !g.archivo) {
      return false;
    }
    // Configurable fields based on selected client
    if ((!cliente || cliente.campoLinea) && !g.linea) return false;
    if ((!cliente || cliente.campoEta) && !g.eta) return false;
    if ((!cliente || cliente.campoBooking) && (!g.booking || !g.booking.trim())) return false;
    if ((!cliente || cliente.campoTipoContenedor) && !g.tipoContenedor) return false;
    if ((!cliente || cliente.campoSello) && (!g.sello || !g.sello.trim())) return false;
    if ((!cliente || cliente.campoDepot) && (!g.depot || !g.depot.trim())) return false;
    if ((!cliente || cliente.campoPuerto) && !g.puerto) return false;
    if ((!cliente || cliente.campoTipoTransaccion) && !g.tipoTransaccion) return false;
    return true;
  };

  const isEmailHeaderComplete = remitente?.trim() && tituloCorreo?.trim();
  const allCompleted = isEmailHeaderComplete && guias.every(isGuideComplete);

  const isEmpty =
    !remitente && !tituloCorreo && !mensaje &&
    guias.every((g) => 
      !g.linea && !g.eta && !g.booking && !g.conductor && !g.vehiculo && 
      !g.contenedor && !g.tipoContenedor && !g.sello && !g.depot && 
      !g.puerto && !g.tipoTransaccion && !g.archivo && !g.eir && !g.observaciones
    );

  const today = new Date().toLocaleDateString("es-EC", {
    day: "numeric", month: "long", year: "numeric",
  });

  // Build dynamic table columns based on selected client's configurations
  const columns = [
    { key: "num", label: "#" },
    { key: "conductor", label: "Conductor" },
    { key: "placa", label: "Placa" },
    { key: "contenedor", label: "Contenedor" }
  ];

  if (!cliente || cliente.campoLinea) columns.push({ key: "linea", label: "Línea" });
  if (!cliente || cliente.campoEta) columns.push({ key: "eta", label: "ETA" });
  if (!cliente || cliente.campoBooking) columns.push({ key: "booking", label: "Booking" });
  if (!cliente || cliente.campoTipoContenedor) columns.push({ key: "tipoContenedor", label: "Tipo" });
  if (!cliente || cliente.campoSello) columns.push({ key: "sello", label: "Sello" });
  if (!cliente || cliente.campoDepot) columns.push({ key: "depot", label: "Depot" });
  if (!cliente || cliente.campoPuerto) columns.push({ key: "puerto", label: "Puerto" });
  if (!cliente || cliente.campoTipoTransaccion) columns.push({ key: "tipoTransaccion", label: "Transacción" });
  if (!cliente || cliente.campoLinkRastreo || cliente.campoPwdRastreo) {
    columns.push({ key: "rastreo", label: "Rastreo" });
  }
  columns.push({ key: "documentos", label: "Adjuntos" });

  const renderCell = (guia, colKey, idx) => {
    switch (colKey) {
      case "num":
        return <span className="ep-cell-num">{idx + 1}</span>;
      case "conductor":
        return guia.conductor 
          ? `${guia.conductor.nombreConductor} ${guia.conductor.apellidoConductor}` 
          : <span className="ep-cell-pending">Pendiente</span>;
      case "placa":
        return guia.vehiculo 
          ? guia.vehiculo.placa 
          : <span className="ep-cell-pending">Pendiente</span>;
      case "contenedor":
        return guia.contenedor?.trim() 
          ? guia.contenedor 
          : <span className="ep-cell-pending">Pendiente</span>;
      case "linea":
        return guia.linea 
          ? guia.linea.nombreLinea 
          : <span className="ep-cell-pending">Pendiente</span>;
      case "eta":
        return guia.eta 
          ? formatEta(guia.eta) 
          : <span className="ep-cell-pending">Pendiente</span>;
      case "booking":
        return guia.booking?.trim() 
          ? guia.booking 
          : <span className="ep-cell-pending">Pendiente</span>;
      case "tipoContenedor":
        return guia.tipoContenedor 
          ? guia.tipoContenedor.tipo 
          : <span className="ep-cell-pending">Pendiente</span>;
      case "sello":
        return guia.sello?.trim() 
          ? guia.sello 
          : <span className="ep-cell-pending">Pendiente</span>;
      case "depot":
        return guia.depot?.trim() 
          ? guia.depot 
          : <span className="ep-cell-pending">Pendiente</span>;
      case "puerto":
        return guia.puerto 
          ? guia.puerto.nombre 
          : <span className="ep-cell-pending">Pendiente</span>;
      case "tipoTransaccion":
        return guia.tipoTransaccion 
          ? guia.tipoTransaccion.descripcion 
          : <span className="ep-cell-pending">Pendiente</span>;
      case "rastreo":
        const link = guia.vehiculo?.linkRastreo;
        const pwd = guia.vehiculo?.pwdRastreo;
        const showLink = !cliente || cliente.campoLinkRastreo;
        const showPwd = !cliente || cliente.campoPwdRastreo;
        
        if (!link && !pwd) return <span className="ep-cell-empty">—</span>;
        
        return (
          <div className="ep-cell-rastreo">
            {showLink && link && (
              <a 
                href={link.startsWith("http") ? link : `https://${link}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="ep-cell-track-link"
              >
                Rastrear
              </a>
            )}
            {showPwd && pwd && (
              <span className="ep-cell-track-pwd" title="Clave de rastreo">
                Clave: {pwd}
              </span>
            )}
          </div>
        );
      case "documentos":
        return (
          <div className="ep-cell-docs">
            {guia.archivo ? (
              <span className="ep-doc-badge ep-doc-badge--guia" title={guia.archivo.name}>Guía</span>
            ) : (
              <span className="ep-cell-pending">Falta Guía</span>
            )}
            {guia.eir && (
              <span className="ep-doc-badge ep-doc-badge--eir" title={guia.eir.name}>EIR</span>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="ep-wrapper">

      {/* Toolbar superior */}
      <div className="ep-toolbar">
        <LuMail className="ep-toolbar-icon" aria-hidden="true" />
        <span className="ep-toolbar-label">Previsualización de Correo de Notificación</span>
        {allCompleted ? (
          <span className="ep-toolbar-badge ep-toolbar-badge--ok">Listo</span>
        ) : (
          <span className="ep-toolbar-badge ep-toolbar-badge--warn">Borrador</span>
        )}
      </div>

      {/* Shell del correo */}
      <div className="ep-email-shell">
        
        {/* Cabecera / Metadata */}
        <div className="ep-client-header">
          <div className="ep-client-meta">
            <div className="ep-client-row">
              <span className="ep-client-field">De:</span>
              <span className="ep-client-value">
                Transgrandanes S.A. &lt;notificaciones@transgrandanes.com&gt;
              </span>
            </div>
            <div className="ep-client-row">
              <span className="ep-client-field">Para:</span>
              <span className={`ep-client-value ${!remitente ? "ep-client-value--empty" : "ep-client-value--muted"}`}>
                {cliente ? (
                  cliente.correos.length > 0
                    ? cliente.correos.map(c => `${c.nombreDestinatario} <${c.correoDestinatario}>`).join(", ")
                    : `${remitente} (Sin destinatarios configurados)`
                ) : (
                  remitente || "— Sin especificar —"
                )}
              </span>
            </div>
            <div className="ep-client-row">
              <span className="ep-client-field">Asunto:</span>
              <span className={`ep-client-value ${!tituloCorreo ? "ep-client-value--empty" : "ep-client-subject"}`}>
                {tituloCorreo || "— Sin asunto —"}
              </span>
            </div>
            <div className="ep-client-row">
              <span className="ep-client-field">Fecha:</span>
              <span className="ep-client-value ep-client-value--muted">{today}</span>
            </div>
          </div>
        </div>

        {/* Cuerpo del correo */}
        <div className="ep-email-body">
          {isEmpty ? (
            <div className="ep-empty-state">
              <LuMail className="ep-empty-icon" aria-hidden="true" />
              <p className="ep-empty-title">El correo aparecerá aquí</p>
              <p className="ep-empty-hint">
                Comienza a llenar el formulario para ver una previsualización en tiempo real.
              </p>
            </div>
          ) : (
            <>
              {/* Encabezado Transgrandanes */}
              <div className="ep-banner">
                <div className="ep-banner-logo">TG</div>
                <div className="ep-banner-info">
                  <p className="ep-banner-company">Transgrandanes S.A.</p>
                  <p className="ep-banner-tagline">Detalle de Nuevo Lote de Movimientos</p>
                </div>
              </div>

              {/* Saludo y mensaje */}
              <div className="ep-greeting">
                <p>Estimado cliente <strong>{remitente || "—"}</strong>,</p>
                <p>
                  Nos complace informarle que hemos procesado un nuevo lote de envíos
                  asignado a su cuenta.{mensaje && <> {mensaje}</>}
                </p>
              </div>

              {/* Única tabla consolidada de guías */}
              <div className="ep-table-container">
                <table className="ep-dynamic-table">
                  <thead>
                    <tr>
                      {columns.map((col) => (
                        <th key={col.key}>{col.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {guias.map((guia, idx) => (
                      <tr key={guia.id}>
                        {columns.map((col) => (
                          <td key={col.key}>
                            {renderCell(guia, col.key, idx)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Observaciones consolidadas si existen */}
              {guias.some(g => g.observaciones?.trim()) && (
                <div className="ep-consolidated-obs">
                  <span className="ep-obs-section-title">Observaciones de las guías:</span>
                  <ul className="ep-obs-list">
                    {guias.map((g, idx) => g.observaciones?.trim() ? (
                      <li key={g.id} className="ep-obs-item">
                        <strong>Guía {idx + 1}:</strong> {g.observaciones}
                      </li>
                    ) : null)}
                  </ul>
                </div>
              )}

              {/* Pie de firma */}
              <div className="ep-footer">
                <p>Este correo fue generado automáticamente por el sistema de gestión de lotes de <strong>Transgrandanes S.A.</strong></p>
                <div className="ep-footer-divider" />
                <p className="ep-footer-meta">© {new Date().getFullYear()} Transgrandanes S.A. · Ecuador</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Pie de acción — botón de enviar */}
      <div className="ep-action-footer">
        <p className="ep-action-hint">
          Revisa el correo consolidado y cuando esté listo, confírmalo para enviarlo.
        </p>
        <button type="submit" className="ep-send-btn">
          <LuSend aria-hidden="true" /> Crear y enviar lote
        </button>
      </div>

    </div>
  );
};
import { LuMail, LuPackage, LuCircleAlert } from "react-icons/lu";
import { GuiaTable } from "../../../components/ui/GuiaTable";
import "./EmailPreview.css";

/* Campos requeridos para considerar el correo "completo" */
const CAMPOS_CORREO = [
  { key: "remitente",    label: "Cliente / Remitente" },
  { key: "tituloCorreo", label: "Título del correo" },
  { key: "mensaje",      label: "Mensaje" },
];

const CAMPOS_GUIA = [
  { key: "idLinea",    label: "Línea naviera" },
  { key: "eta",        label: "ETA" },
  { key: "booking",    label: "Booking" },
  { key: "conductor",  label: "Conductor" },
  { key: "placa",      label: "Placa" },
  { key: "contenedor", label: "Contenedor" },
  { key: "sello",      label: "Sello" },
  { key: "origen",     label: "Origen" },
  { key: "destino",    label: "Puerto destino" },
];

const CamposFaltantes = ({ faltantes }) => {
  if (faltantes.length === 0) return null;
  return (
    <div className="ep-missing">
      <div className="ep-missing-header">
        <LuCircleAlert className="ep-missing-icon" aria-hidden="true" />
        <span className="ep-missing-title">Campos por completar</span>
      </div>
      <ul className="ep-missing-list">
        {faltantes.map((f) => (
          <li key={f} className="ep-missing-item">{f}</li>
        ))}
      </ul>
    </div>
  );
};

export const EmailPreview = ({ remitente, tituloCorreo, mensaje, guias }) => {
  /* Campos vacíos del correo general */
  const correoData = { remitente, tituloCorreo, mensaje };
  const faltantesCorreo = CAMPOS_CORREO
    .filter(({ key }) => !correoData[key]?.trim())
    .map(({ label }) => label);

  /* Campos vacíos por guía */
  const faltantesPorGuia = guias.map((guia) =>
    CAMPOS_GUIA.filter(({ key }) => !guia[key]?.toString().trim()).map(({ label }) => label)
  );

  const totalFaltantes = faltantesCorreo.length + faltantesPorGuia.reduce((acc, f) => acc + f.length, 0);

  const isEmpty =
    !remitente && !tituloCorreo && !mensaje &&
    guias.every((g) => CAMPOS_GUIA.every(({ key }) => !g[key]));

  const today = new Date().toLocaleDateString("es-EC", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="ep-wrapper">
      <div className="ep-toolbar">
        <LuMail className="ep-toolbar-icon" aria-hidden="true" />
        <span className="ep-toolbar-label">Previsualización del correo</span>
        {totalFaltantes > 0 ? (
          <span className="ep-toolbar-badge ep-toolbar-badge--warn">
            {totalFaltantes} campo{totalFaltantes !== 1 ? "s" : ""} faltante{totalFaltantes !== 1 ? "s" : ""}
          </span>
        ) : (
          <span className="ep-toolbar-badge ep-toolbar-badge--ok">Completo</span>
        )}
      </div>

      {/* Indicador de campos faltantes del correo */}
      {faltantesCorreo.length > 0 && (
        <CamposFaltantes faltantes={faltantesCorreo} />
      )}

      <div className="ep-email-shell">
        <div className="ep-client-header">
          <div className="ep-client-dots">
            <span className="ep-dot ep-dot--red" />
            <span className="ep-dot ep-dot--yellow" />
            <span className="ep-dot ep-dot--green" />
          </div>
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
                {remitente || "— Sin especificar —"}
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
              <div className="ep-banner">
                <div className="ep-banner-logo">TG</div>
                <div className="ep-banner-info">
                  <p className="ep-banner-company">Transgrandanes S.A.</p>
                  <p className="ep-banner-tagline">Notificación de nuevo lote</p>
                </div>
              </div>

              <div className="ep-section ep-greeting">
                <p>
                  Estimado(a) <strong>{remitente || "—"}</strong>,
                </p>
                <p>
                  Nos complace informarle que hemos procesado un nuevo lote de envíos
                  asignado a su cuenta.{mensaje && <> {mensaje}</>}
                </p>
              </div>

              <div className="ep-section">
                <p className="ep-section-heading">
                  <LuPackage aria-hidden="true" />
                  Detalle de guías ({guias.length})
                </p>
                <div className="ep-guias-list">
                  {guias.map((guia, i) => (
                    <div key={guia.id}>
                      {faltantesPorGuia[i].length > 0 && (
                        <CamposFaltantes
                          faltantes={faltantesPorGuia[i].map((f) => `Guía ${i + 1}: ${f}`)}
                        />
                      )}
                      <GuiaTable guia={guia} index={i} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="ep-footer">
                <p>
                  Este correo fue generado automáticamente por el sistema de gestión
                  de lotes de <strong>Transgrandanes S.A.</strong>
                </p>
                <div className="ep-footer-divider" />
                <p className="ep-footer-meta">
                  © {new Date().getFullYear()} Transgrandanes S.A. · Ecuador
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
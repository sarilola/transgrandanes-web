import {
  LuTruck, LuAnchor, LuMapPin, LuCalendar,
  LuHash, LuFileText, LuShield, LuPackage
} from "react-icons/lu";
import "./GuiaTable.css";

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

const ROWS = [
  { icon: LuAnchor,   label: "Línea naviera", key: "idLinea" },
  { icon: LuCalendar, label: "ETA",            key: "eta",    format: formatEta },
  { icon: LuHash,     label: "Booking",        key: "booking" },
  { icon: LuTruck,    label: "Conductor",      key: "conductor" },
  { icon: LuTruck,    label: "Placa",          key: "placa" },
  { icon: LuPackage,  label: "Contenedor",     key: "contenedor" },
  { icon: LuShield,   label: "Sello",          key: "sello" },
  { icon: LuMapPin,   label: "Tipo de Transacción", key: "tipoTransaccion" },
  { icon: LuAnchor,   label: "Puerto", key: "puerto" },
];

export const GuiaTable = ({ guia, index }) => {
  const filas = ROWS.filter(({ key }) => {
    const v = guia[key];
    return v !== null && v !== undefined && v !== "";
  });

  const isEmpty = filas.length === 0 && !guia.observaciones && !guia.archivo;

  return (
    <div className="gt-card">
      <div className="gt-header">
        <LuPackage className="gt-header-icon" aria-hidden="true" />
        <span className="gt-header-title">Guía {index + 1}</span>
        {guia.archivo && (
          <span className="gt-header-badge">
            <LuFileText aria-hidden="true" />
            {guia.archivo.name}
          </span>
        )}
      </div>

      {isEmpty ? (
        <div className="gt-empty">
          Completa los campos de esta guía para ver el detalle.
        </div>
      ) : (
        <div className="gt-body">
          {filas.length > 0 && (
            <table className="gt-table">
              <tbody>
                {filas.map(({ icon: Icon, label, key, format }) => (
                  <tr key={key} className="gt-row">
                    <td className="gt-cell-label">
                      <Icon className="gt-row-icon" aria-hidden="true" />
                      <span className="gt-label-text">{label}</span>
                    </td>
                    <td className="gt-cell-value">
                      {format ? format(guia[key]) : guia[key]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {guia.observaciones && (
            <div className="gt-obs">
              <p className="gt-obs-label">Observaciones</p>
              <p className="gt-obs-text">{guia.observaciones}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
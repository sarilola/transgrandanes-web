import {
  LuTruck, LuAnchor, LuMapPin, LuCalendar,
  LuHash, LuFileText, LuShield, LuPackage,
  LuLink, LuLock
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

const getFilas = (guia, cliente) => {
  const filas = [];

  // Conductor (Fijo)
  if (guia.conductor) {
    filas.push({
      icon: LuTruck,
      label: "Conductor",
      value: `${guia.conductor.nombreConductor} ${guia.conductor.apellidoConductor}`
    });
  }

  // Placa (Fijo)
  if (guia.vehiculo) {
    filas.push({
      icon: LuTruck,
      label: "Placa",
      value: guia.vehiculo.placa
    });
  }

  // Contenedor (Fijo)
  if (guia.contenedor && guia.contenedor.trim()) {
    filas.push({
      icon: LuPackage,
      label: "Contenedor",
      value: guia.contenedor
    });
  }

  // Línea naviera
  if ((!cliente || cliente.campoLinea) && guia.linea) {
    filas.push({
      icon: LuAnchor,
      label: "Línea naviera",
      value: guia.linea.nombreLinea
    });
  }

  // ETA
  if ((!cliente || cliente.campoEta) && guia.eta) {
    filas.push({
      icon: LuCalendar,
      label: "ETA",
      value: formatEta(guia.eta)
    });
  }

  // Booking / Documento
  if ((!cliente || cliente.campoBooking) && guia.booking && guia.booking.trim()) {
    filas.push({
      icon: LuHash,
      label: "Booking",
      value: guia.booking
    });
  }

  // Tipo de Contenedor
  if ((!cliente || cliente.campoTipoContenedor) && guia.tipoContenedor) {
    filas.push({
      icon: LuPackage,
      label: "Tipo de Contenedor",
      value: guia.tipoContenedor.tipo
    });
  }

  // Sello
  if ((!cliente || cliente.campoSello) && guia.sello && guia.sello.trim()) {
    filas.push({
      icon: LuShield,
      label: "Sello",
      value: guia.sello
    });
  }

  // Depot
  if ((!cliente || cliente.campoDepot) && guia.depot && guia.depot.trim()) {
    filas.push({
      icon: LuMapPin,
      label: "Depot",
      value: guia.depot
    });
  }

  // Puerto
  if ((!cliente || cliente.campoPuerto) && guia.puerto) {
    filas.push({
      icon: LuAnchor,
      label: "Puerto",
      value: guia.puerto.nombre
    });
  }

  // Tipo de Transacción
  if ((!cliente || cliente.campoTipoTransaccion) && guia.tipoTransaccion) {
    filas.push({
      icon: LuMapPin,
      label: "Tipo de Transacción",
      value: guia.tipoTransaccion.descripcion
    });
  }

  // Link de rastreo
  if ((!cliente || cliente.campoLinkRastreo) && guia.vehiculo?.linkRastreo) {
    filas.push({
      icon: LuLink,
      label: "Link de Rastreo",
      value: guia.vehiculo.linkRastreo,
      isLink: true
    });
  }

  // Password de rastreo
  if ((!cliente || cliente.campoPwdRastreo) && guia.vehiculo?.pwdRastreo) {
    filas.push({
      icon: LuLock,
      label: "Clave de Rastreo",
      value: guia.vehiculo.pwdRastreo
    });
  }

  return filas;
};

export const GuiaTable = ({ guia, index, cliente = null }) => {
  const filas = getFilas(guia, cliente);
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
                {filas.map(({ icon: Icon, label, value, isLink }) => (
                  <tr key={label} className="gt-row">
                    <td className="gt-cell-label">
                      <Icon className="gt-row-icon" aria-hidden="true" />
                      <span className="gt-label-text">{label}</span>
                    </td>
                    <td className="gt-cell-value">
                      {isLink ? (
                        <a 
                          href={value.startsWith("http") ? value : `https://${value}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="ep-tracking-link"
                          style={{ color: "var(--primary)", textDecoration: "underline" }}
                        >
                          Rastrear Vehículo
                        </a>
                      ) : (
                        value
                      )}
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
import { useState } from "react";
import {
  LuPackagePlus, LuPlus, LuMinus, LuMail,
  LuHash, LuUser, LuFileText
} from "react-icons/lu";
import { FileUpload } from "../../../components/ui/FileUpload";
import { FormSection } from "../../../components/ui/FormSection";
import { FormField } from "../../../components/ui/FormField";
import { EmailPreview } from "./EmailPreview";
import AutocompleteInput from "../../../components/ui/AutocompleteInput";
import "./CrearLoteForm.css";

let nextGuiaId = 1;

const guiaVacia = () => ({
  id: nextGuiaId++,
  linea:           null,   // { idLinea, nombreLinea }
  eta:             '',
  booking:         '',
  conductor:       null,   // { idConductor, nombreConductor, apellidoConductor }
  vehiculo:        null,   // { idVehiculo, placa }
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
  const [remitente, setRemitente]       = useState("");
  const [tituloCorreo, setTituloCorreo] = useState("");
  const [mensaje, setMensaje]           = useState("");
  const [guias, setGuias]               = useState([guiaVacia()]);

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
    <form onSubmit={handleSubmit} className="clf-layout">

      {/* ── Bloque superior: previsualización ── */}
      <div className="clf-preview-block">
        <EmailPreview
          remitente={remitente}
          tituloCorreo={tituloCorreo}
          mensaje={mensaje}
          guias={guias}
        />
      </div>

      {/* ── Formulario de detalles ── */}
      <div className="clf-form-col">
        <div className="clf-form">

          <FormSection icon={LuMail} title="Información del correo">
            <div className="clf-grid-2">
              <FormField
                label="Cliente (Remitente)"
                icon={LuUser}
                placeholder="Ej: Importaciones García S.A."
                value={remitente}
                onChange={(e) => setRemitente(e.target.value)}
              />
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

          {guias.map((guia, index) => (
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
                <AutocompleteInput
                  label="Línea naviera"
                  placeholder="Buscar línea naviera..."
                  endpoint="/api/lineas/autocompletar"
                  labelKey={(item) => item.nombreLinea}
                  sublabelKey={(item) => `ID: ${item.idLinea}`}
                  onSelect={(item) => actualizarGuia(guia.id, "linea", item)}
                  value={guia.linea}
                />
                <FormField
                  label="ETA (Llegada estimada)"
                  type="datetime-local"
                  value={guia.eta}
                  onChange={(e) => actualizarGuia(guia.id, "eta", e.target.value)}
                />
              </div>

              <div className="clf-grid-3">
                <FormField
                  label="Booking"
                  icon={LuHash}
                  value={guia.booking}
                  onChange={(e) => actualizarGuia(guia.id, "booking", e.target.value)}
                />
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

              <div className="clf-grid-4">
                <FormField
                  label="Contenedor"
                  value={guia.contenedor}
                  onChange={(e) => actualizarGuia(guia.id, "contenedor", e.target.value)}
                />
                <AutocompleteInput
                  label="Tipo de Contenedor"
                  placeholder="Buscar tipo..."
                  endpoint="/api/tipos-contenedor/autocompletar"
                  labelKey={(item) => item.tipo}
                  sublabelKey={(item) => `ID: ${item.idTipoContenedor}`}
                  onSelect={(item) => actualizarGuia(guia.id, "tipoContenedor", item)}
                  value={guia.tipoContenedor}
                />
                <FormField
                  label="Sello"
                  value={guia.sello}
                  onChange={(e) => actualizarGuia(guia.id, "sello", e.target.value)}
                />
                <FormField
                  label="Depot"
                  value={guia.depot}
                  onChange={(e) => actualizarGuia(guia.id, "depot", e.target.value)}
                />
                <AutocompleteInput
                  label="Puerto"
                  placeholder="Buscar puerto..."
                  endpoint="/api/puertos/autocompletar"
                  labelKey={(item) => item.nombre}
                  sublabelKey={(item) => `ID: ${item.idPuerto}`}
                  onSelect={(item) => actualizarGuia(guia.id, "puerto", item)}
                  value={guia.puerto}
                />
                <AutocompleteInput
                  label="Tipo de Transacción"
                  placeholder="Buscar tipo..."
                  endpoint="/api/tipos-transaccion/autocompletar"
                  labelKey={(item) => item.descripcion}
                  sublabelKey={(item) => `ID: ${item.idTransaccion}`}
                  onSelect={(item) => actualizarGuia(guia.id, "tipoTransaccion", item)}
                  value={guia.tipoTransaccion}
                />
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
          ))}

          <button type="button" onClick={agregarGuia} className="clf-add-btn">
            <LuPlus /> Agregar otra guía
          </button>

        </div>
      </div>

    </form>
  );
}
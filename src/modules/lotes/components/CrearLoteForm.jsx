import { useState } from "react";
import {
  LuPackagePlus, LuTruck, LuPlus, LuMinus, LuMail, LuAnchor,
  LuHash, LuUser, LuFileText, LuMapPin
} from "react-icons/lu";
import { FileUpload } from "../../../components/ui/FileUpload";
import { FormSection } from "../../../components/ui/FormSection";
import { FormField } from "../../../components/ui/FormField";
import { EmailPreview } from "./EmailPreview";
import "./CrearLoteForm.css";

const guiaVacia = () => ({
  id: Date.now(),
  idLinea: "",
  eta: "",
  booking: "",
  conductor: "",
  licencia: "",
  placa: "",
  contenedor: "",
  sello: "",
  origen: "",
  destino: "",
  archivo: null,
  observaciones: "",
});

export default function CrearLoteForm() {
  const [remitente, setRemitente] = useState("");
  const [tituloCorreo, setTituloCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [guias, setGuias] = useState([guiaVacia()]);

  const agregarGuia = () => setGuias((prev) => [...prev, guiaVacia()]);

  const removerGuia = (id) =>
    setGuias((prev) => (prev.length > 1 ? prev.filter((g) => g.id !== id) : prev));

  const actualizarGuia = (id, campo, valor) =>
    setGuias((prev) =>
      prev.map((g) => (g.id === id ? { ...g, [campo]: valor } : g))
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Generando Lote:", { remitente, tituloCorreo, mensaje, guias });
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
                <FormField
                  label="ID Línea naviera"
                  icon={LuAnchor}
                  placeholder="Ej: MAERSK-01"
                  value={guia.idLinea}
                  onChange={(e) => actualizarGuia(guia.id, "idLinea", e.target.value)}
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
                <FormField
                  label="Conductor"
                  icon={LuTruck}
                  value={guia.conductor}
                  onChange={(e) => actualizarGuia(guia.id, "conductor", e.target.value)}
                />
                <FormField
                  label="Placa"
                  icon={LuTruck}
                  value={guia.placa}
                  onChange={(e) => actualizarGuia(guia.id, "placa", e.target.value)}
                />
              </div>

              <div className="clf-grid-4">
                <FormField
                  label="Contenedor"
                  value={guia.contenedor}
                  onChange={(e) => actualizarGuia(guia.id, "contenedor", e.target.value)}
                />
                <FormField
                  label="Sello"
                  value={guia.sello}
                  onChange={(e) => actualizarGuia(guia.id, "sello", e.target.value)}
                />
                <FormField
                  label="Origen"
                  icon={LuMapPin}
                  value={guia.origen}
                  onChange={(e) => actualizarGuia(guia.id, "origen", e.target.value)}
                />
                <FormField
                  label="Puerto destino"
                  icon={LuAnchor}
                  value={guia.destino}
                  onChange={(e) => actualizarGuia(guia.id, "destino", e.target.value)}
                />
              </div>

              <FileUpload
                label="Guía de remisión"
                onFileChange={(file) => actualizarGuia(guia.id, "archivo", file)}
                file={guia.archivo}
                acceptedExtensions={["pdf", "jpg", "jpeg", "png"]}
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
import { useState } from "react";
import { LuPackagePlus, LuTruck, LuPlus, LuMinus, LuMail } from "react-icons/lu";
import { FileUpload } from "../../../components/ui/FileUpload";
import "./CrearLoteForm.css";

export default function CrearLoteForm() {
  const [remitente, setRemitente] = useState('');
  const [tituloCorreo, setTituloCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [guias, setGuias] = useState([
    {
      id: 1,
      idLinea: '',
      eta: '',
      booking: '',
      conductor: '',
      licencia: '',
      placa: '',
      contenedor: '',
      sello: '',
      origen: '',
      destino: '',
      archivo: null,
      observaciones: ''
    }
  ]);

  const agregarGuia = () => {
    setGuias((prevGuias) => {
      const nextId = prevGuias.length > 0 ? Math.max(...prevGuias.map((guia) => guia.id)) + 1 : 1;
      return [
        ...prevGuias,
        {
          id: nextId,
          idLinea: '',
          eta: '',
          booking: '',
          conductor: '',
          licencia: '',
          placa: '',
          contenedor: '',
          sello: '',
          origen: '',
          destino: '',
          archivo: null,
          observaciones: ''
        }
      ];
    });
  };

  const removerGuia = (id) => {
    setGuias((prevGuias) =>
      prevGuias.length > 1 ? prevGuias.filter((guia) => guia.id !== id) : prevGuias
    );
  };

  const actualizarGuia = (id, campo, valor) => {
    setGuias((prevGuias) =>
      prevGuias.map((guia) =>
        guia.id === id ? { ...guia, [campo]: valor } : guia
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataLote = { remitente, tituloCorreo, mensaje, guias };
    console.log('Generando Lote Profesional:', dataLote);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Apartado del remitente y correo */}
        <div className="form-section">
          <div className="flex items-center gap-2 mb-6 border-b border-current pb-2">
            <LuMail className="form-highlight text-xl" />
            <h3 className="text-lg font-semibold form-highlight">Información del Correo</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1">
              <label className="form-label">Cliente (Remitente)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ej: Importaciones García S.A."
                value={remitente}
                onChange={(e) => setRemitente(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="form-label">Título del Correo</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ej: Notificación de nuevo lote #001"
                value={tituloCorreo}
                onChange={(e) => setTituloCorreo(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="form-label">Mensaje</label>
            <textarea
              className="form-input form-textarea text-sm"
              placeholder="Escribe el mensaje que se enviará junto al lote..."
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
            ></textarea>
          </div>
        </div>

        {guias.map((guia, index) => (
          <div key={guia.id} className="form-section relative">
            <div className="flex items-center justify-between mb-6 border-b border-current pb-2">
              <h3 className="text-lg font-semibold form-highlight">Guia {index + 1}</h3>
              {guias.length > 1 && (
                <button type="button" onClick={() => removerGuia(guia.id)} className="text-red-500 hover:text-red-700 transition">
                  <LuMinus size={20} />
                </button>
              )}
            </div>

            {/* Linea Naviera y ETA por guia */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <label className="form-label">ID Linea Naviera</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ej: MAERSK-01" 
                  value={guia.idLinea} 
                  onChange={(e) => actualizarGuia(guia.id, 'idLinea', e.target.value)} 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="form-label">ETA (Llegada estimada)</label>
                <input 
                  type="datetime-local" 
                  className="form-input" 
                  value={guia.eta} 
                  onChange={(e) => actualizarGuia(guia.id, 'eta', e.target.value)} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <label className="form-label text-xs font-bold">Booking</label>
                <input type="text" className="form-input" value={guia.booking} onChange={(e) => actualizarGuia(guia.id, 'booking', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="form-label italic flex items-center gap-1"><LuTruck className="text-sm" /> Conductor</label>
                <input type="text" className="form-input" value={guia.conductor} onChange={(e) => actualizarGuia(guia.id, 'conductor', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="form-label">Placa</label>
                <input type="text" className="form-input" value={guia.placa} onChange={(e) => actualizarGuia(guia.id, 'placa', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <label className="form-label">Contenedor</label>
                <input type="text" className="form-input" value={guia.contenedor} onChange={(e) => actualizarGuia(guia.id, 'contenedor', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="form-label">Sello</label>
                <input type="text" className="form-input" value={guia.sello} onChange={(e) => actualizarGuia(guia.id, 'sello', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="form-label">Origen</label>
                <input type="text" className="form-input" value={guia.origen} onChange={(e) => actualizarGuia(guia.id, 'origen', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="form-label">Puerto Destino</label>
                <input type="text" className="form-input" value={guia.destino} onChange={(e) => actualizarGuia(guia.id, 'destino', e.target.value)} />
              </div>
            </div>

            <div className="mb-4">
              <FileUpload
                label="Guia de Remision"
                onFileChange={(file) => actualizarGuia(guia.id, 'archivo', file)}
                file={guia.archivo}
                acceptedExtensions={['pdf', 'jpg', 'jpeg', 'png']}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="form-label">Observaciones</label>
              <textarea 
                className="form-input form-textarea text-sm" 
                placeholder="Detalles adicionales de esta guia..."
                value={guia.observaciones}
                onChange={(e) => actualizarGuia(guia.id, 'observaciones', e.target.value)}
              ></textarea>
            </div>
          </div>
        ))}

        <div className="flex justify-center py-4">
          <button
            type="button"
            onClick={agregarGuia}
            className="form-button flex items-center gap-2"
          >
            <LuPlus /> Agregar otra Guia
          </button>
        </div>

        <div className="flex justify-end pt-6 border-t border-current">
          <button type="submit" className="submit-button flex items-center gap-2">
            <LuPackagePlus /> Crear Nuevo Lote
          </button>
        </div>
      </form>
    </div>
  );
}
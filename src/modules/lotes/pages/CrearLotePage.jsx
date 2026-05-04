import CrearLoteForm from "../components/CrearLoteForm";

export default function CrearLotePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Crear Nuevo Lote
      </h1>
      <p className="text-gray-300">
        <CrearLoteForm />
      </p>
    </div>
  );
}
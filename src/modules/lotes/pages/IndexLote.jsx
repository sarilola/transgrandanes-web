import { useNavigate } from 'react-router-dom';
import { Button1 } from "../../../components/ui/Button1";


export default function IndexLote() {
  const navigate = useNavigate()
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">
          Historial de Lotes
        </h1>
        <Button1 label="Crear Nuevo Lote" onClick={() => navigate("/lotes/crear")} />
      </div>
      
      <div className=" p-8 rounded-[10px] text-center">
        <p className="text-gray-400 italic">
          La tabla con el historial de lotes se mostrará aquí. Esta sección está en construcción.
        </p>
      </div>
    </div>
  );
}
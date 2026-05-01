import { useEffect, useState } from "react";
import Navbar from "./components/shared/Navbar";
import FormularioLote from "./modules/lotes/pages/CrearLotePage";

function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      
      <Navbar toggleTheme={() => setDark(!dark)} />

      <main className="max-w-7xl mx-auto pt-20 px-4">
        <FormularioLote />
      </main>

    </div>
  );
}

export default App;
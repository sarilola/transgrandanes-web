import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/shared/Navbar";
import IndexLotes from "./modules/lotes/pages/IndexLote";
import CrearLotePage from "./modules/lotes/pages/CrearLotePage";

function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <Router>      
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
        
        <Navbar toggleTheme={() => setDark(!dark)} />

        <main className="max-w-7xl mx-auto pt-20 px-4">
          <Routes>
            <Route path="/" element={<IndexLotes />} />
            <Route path="/lotes/crear" element={<CrearLotePage />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;
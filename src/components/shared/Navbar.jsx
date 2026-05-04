{/* Barra de navegación */}
import { useState } from "react";
import { FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import logo from "../../assets/logo.svg";

export default function Navbar({ toggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-[var(--nav)] border-b border-gray-200 dark:border-gray-800">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <img src={logo} alt="Logo Transgrandanes" className="h-12 w-auto" />

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 items-center">
          <li className="cursor-pointer hover:text-primary">Lotes</li>
          <li className="cursor-pointer hover:text-primary">Servicios</li>
          <li className="cursor-pointer hover:text-primary">Proyectos</li>
          <li className="cursor-pointer hover:text-primary">Contacto</li>
        </ul>

        <div className="flex items-center gap-4">

          {/* Botón */}
          <button className="hidden md:block bg-primary text-white px-4 py-2 rounded-full hover:bg-red-700 transition">
            Empezar
          </button>

          {/* Toggle Dark Mode */}
          <button
            onClick={toggleTheme}
            className="text-xl p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            <FaMoon className="dark:hidden" />
            <FaSun className="hidden dark:block" />
          </button>

          {/* Mobile Icon */}
          <div
            className="md:hidden text-2xl cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-80" : "max-h-0"}`}>
        <ul className="flex flex-col items-center gap-6 py-6">
          <li className="cursor-pointer hover:text-primary">Lotes</li>
          <li className="cursor-pointer hover:text-primary">Servicios</li>
          <li className="cursor-pointer hover:text-primary">Proyectos</li>
          <li className="cursor-pointer hover:text-primary">Contacto</li>
          <button className="bg-primary text-white px-4 py-2 rounded-full hover:bg-red-700 transition">
            Empezar
          </button>
        </ul>
      </div>

    </nav>
  );
}
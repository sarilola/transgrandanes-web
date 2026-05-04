// src/components/ui/Button1.jsx
export const Button1 = ({ label, onClick, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-primary text-white text-center px-4 py-2 w-full md:w-fit rounded-[10px] hover:bg-red-700 transition-all cursor-pointer active:scale-95"
    >
      {label}
    </button>
  );
};
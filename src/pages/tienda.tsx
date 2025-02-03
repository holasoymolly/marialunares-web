import { useEffect } from "react";

export default function Tienda() {
  useEffect(() => {
    // Redirige automáticamente a la tienda externa
    window.location.href = "https://marialunares.printful.me/";
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p>Redirigiendo a la tienda...</p>
    </div>
  );
}
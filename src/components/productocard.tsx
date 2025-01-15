import Image from "next/image";
import { useState } from "react";

interface Producto {
  id: string;
  title: string;
  images: { src: string }[];
  price: number;
}

interface ProductoCardProps {
  producto: Producto;
  onComprar: () => void; // Función para manejar clic en el botón "Comprar"
}

export default function ProductoCard({ producto, onComprar }: ProductoCardProps) {
  const [mostrarGaleria, setMostrarGaleria] = useState(false);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(
    producto.images[0]?.src || null
  );

  return (
    <div className="text-center">
      {/* Imagen principal con efecto de hover */}
      <Image
        src={producto.images[0]?.src || "/images/placeholder.jpg"}
        alt={producto.title}
        width={200}
        height={200}
        className="mx-auto mb-4 mt-20 object-cover rounded-lg cursor-pointer transition-transform transform hover:scale-110"
        onClick={() => setMostrarGaleria(true)} // Abre la galería al hacer clic
      />

      <h2 className="text-2xl font-semibold mb-2">{producto.title}</h2>
      <p className="text-lg mb-4">
        ${producto.price ? producto.price.toFixed(2) : "30.00"} USD
      </p>

      {/* Botón de Comprar con efecto hover y scale */}
      <button
        className="px-8 py-2 bg-white text-black font-bold rounded-full transition-transform transform hover:scale-110"
        onClick={onComprar}
      >
        Comprar
      </button>

      {/* Galería de imágenes en modal */}
      {mostrarGaleria && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg p-6 max-w-2xl w-full relative">
            <button
              className="absolute top-2 right-4 text-2xl font-bold text-black"
              onClick={() => setMostrarGaleria(false)} // Cierra la galería
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-4">Galería de {producto.title}</h3>

            {/* Imagen seleccionada */}
            {imagenSeleccionada && (
              <div className="mb-6 flex justify-center">
                <Image
                  src={imagenSeleccionada}
                  alt="Imagen seleccionada"
                  width={400}
                  height={400}
                  className="object-contain rounded-lg"
                />
              </div>
            )}

            {/* Miniaturas de la galería */}
            <div className="flex overflow-x-auto space-x-4 justify-center">
              {producto.images.map((image, index) => (
                <Image
                  key={index}
                  src={image.src}
                  alt={`${producto.title} image ${index + 1}`}
                  width={100} // Ajusta el tamaño como prefieras
                  height={100}
                  className={`h-24 w-24 object-cover rounded-md cursor-pointer transition-transform transform hover:scale-110 ${
                    imagenSeleccionada === image.src ? "ring-2 ring-black" : ""
                  }`}
                  onClick={() => setImagenSeleccionada(image.src)} // Actualiza la imagen seleccionada
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
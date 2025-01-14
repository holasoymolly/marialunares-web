import Image from "next/image";

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
  return (
    <div className="text-center">
      <Image
        src={producto.images[0]?.src || "/images/placeholder.jpg"}
        alt={producto.title}
        width={200}
        height={200}
        className="mx-auto mb-4 mt-20 object-cover rounded-lg"
      />
      <h2 className="text-2xl font-semibold mb-2">{producto.title}</h2>
      <p className="text-lg mb-4">
      ${producto.price ? producto.price.toFixed(2) : "30.00"} USD
      </p>      <button
        className="px-8 py-2 bg-white text-black font-bold rounded-full"
        onClick={onComprar}
      >
        Comprar
      </button>
    </div>
  );
}
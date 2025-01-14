interface Producto {
    id: string;
    title: string;
    images?: { src: string }[]; // Agregamos las imágenes
    options?: { name: string; values: string[] }[];
  }
  
  interface Pedido {
    size: string;
    color: string;
    quantity: number;
  }
  
  interface ModalProductoProps {
    producto: Producto | null;
    pedido: Pedido | null;
    setPedido: (pedido: Pedido) => void;
    onClose: () => void;
    onAddToCart: (pedido: Pedido) => void; // Se pasa el pedido como argumento
  }
  
  export default function ModalProducto({
    producto,
    pedido,
    setPedido,
    onClose,
    onAddToCart,
  }: ModalProductoProps) {
    if (!producto) return null;
  
    const handleAddToCart = () => {
      if (pedido && pedido.size && pedido.color && pedido.quantity > 0) {
        onAddToCart(pedido); // Llama a la función onAddToCart con el pedido
      } else {
        alert("Por favor, selecciona todas las opciones y una cantidad válida.");
      }
    };
  
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="bg-white text-black rounded-lg p-6 max-w-lg w-full relative">
          <button
            className="absolute top-2 right-4 text-2xl font-bold text-black"
            onClick={onClose}
          >
            ×
          </button>
          <h2 className="text-3xl font-bold mb-4">{producto.title}</h2>
  
          {/* Galería de imágenes */}
          <div className="mb-6">
            {producto.images && producto.images.length > 0 ? (
              <div className="flex overflow-x-auto space-x-4">
                {producto.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.src}
                    alt={`${producto.title} image ${index + 1}`}
                    className="h-32 w-32 object-cover rounded-md cursor-pointer transition-transform transform hover:scale-110"
                    onClick={() =>
                      alert(`Mostrando imagen ${index + 1}: ${image.src}`)
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hay imágenes disponibles.</p>
            )}
          </div>
  
          {/* Opciones del producto */}
          <div>
            <label className="block mb-2">
              Tamaño:
              <select
                className="w-full p-2 border rounded mb-4"
                onChange={(e) =>
                  setPedido({ ...pedido, size: e.target.value } as Pedido)
                }
              >
                <option value="">Seleccionar tamaño</option>
                {producto.options?.[0]?.values.map((size, index) => (
                  <option key={index} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
  
            <label className="block mb-2">
              Color:
              <select
                className="w-full p-2 border rounded mb-4"
                onChange={(e) =>
                  setPedido({ ...pedido, color: e.target.value } as Pedido)
                }
              >
                <option value="">Seleccionar color</option>
                {producto.options?.[1]?.values.map((color, index) => (
                  <option key={index} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </label>
  
            <label className="block mb-2">
              Cantidad:
              <input
                type="number"
                min="1"
                defaultValue="1"
                className="w-full p-2 border rounded mb-4"
                onChange={(e) =>
                  setPedido({
                    ...pedido,
                    quantity: parseInt(e.target.value, 10) || 1,
                  } as Pedido)
                }
              />
            </label>
  
            <button
              className="px-8 py-2 bg-black text-white font-bold rounded-full"
              onClick={handleAddToCart}
            >
              Añadir al Carrito
            </button>
          </div>
        </div>
      </div>
    );
  }
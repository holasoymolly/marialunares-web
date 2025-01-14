interface FormularioEnvioProps {
    formulario: {
      nombre: string;
      direccion: string;
      ciudad: string;
      codigoPostal: string;
      telefono: string;
    };
    setFormulario: (nuevoFormulario: {
      nombre: string;
      direccion: string;
      ciudad: string;
      codigoPostal: string;
      telefono: string;
    }) => void;
    onConfirmar: () => void;
    onCancelar: () => void;
  }
  
  export default function FormularioEnvio({
    formulario,
    setFormulario,
    onConfirmar,
    onCancelar,
  }: FormularioEnvioProps) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50">
        <div className="bg-white text-black rounded-lg p-6 max-w-lg w-full">
          <h2 className="text-2xl font-bold mb-4">Información de Envío</h2>
          <form>
            {Object.keys(formulario).map((campo, index) => (
              <div key={index} className="mb-4">
                <label className="block font-semibold mb-2 capitalize">{campo}:</label>
                <input
                  type="text"
                  value={formulario[campo as keyof typeof formulario]}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      [campo]: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}
          </form>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              className="px-4 py-2 bg-gray-300 text-black font-bold rounded-full"
              onClick={onCancelar}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 bg-black text-white font-bold rounded-full"
              onClick={onConfirmar}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    );
  }
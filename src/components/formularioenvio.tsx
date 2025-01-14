import { useState } from "react";

interface FormularioEnvioProps {
  formulario: {
    nombre: string;
    apellido: string;
    direccion1: string;
    direccion2: string;
    codigoPostal: string;
    ciudadEstado: string;
    pais: string;
    telefono: string;
    email: string;
  };
  setFormulario: (nuevoFormulario: {
    nombre: string;
    apellido: string;
    direccion1: string;
    direccion2: string;
    codigoPostal: string;
    ciudadEstado: string;
    pais: string;
    telefono: string;
    email: string;
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
  const [errores, setErrores] = useState<Record<string, string>>({});

  const validarFormulario = () => {
    console.log("Validando formulario con valores:", formulario); // Log para depuración
    const nuevosErrores: Record<string, string> = {};

    if (!formulario.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
    if (!formulario.apellido.trim()) nuevosErrores.apellido = "El apellido es obligatorio.";
    if (!formulario.direccion1.trim())
      nuevosErrores.direccion1 = "La dirección (Línea 1) es obligatoria.";
    if (!formulario.codigoPostal.trim())
      nuevosErrores.codigoPostal = "El código postal es obligatorio.";
    if (!formulario.ciudadEstado.trim())
      nuevosErrores.ciudadEstado = "La ciudad/estado es obligatoria.";
    if (!formulario.pais.trim()) nuevosErrores.pais = "El país es obligatorio.";
    if (!formulario.telefono.trim()) nuevosErrores.telefono = "El teléfono es obligatorio.";
    if (!formulario.email.trim()) {
      nuevosErrores.email = "El correo electrónico es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email)) {
      nuevosErrores.email = "Introduce un correo electrónico válido.";
    }

    setErrores(nuevosErrores);
    console.log("Errores encontrados:", nuevosErrores); // Log para depuración
    return Object.keys(nuevosErrores).length === 0; // Devuelve true si no hay errores
  };

  const manejarConfirmar = (e: React.FormEvent) => {
    e.preventDefault();
    if (validarFormulario()) {
      console.log("Formulario validado correctamente, procediendo...");
      onConfirmar();
    } else {
      console.log("Errores en el formulario, no se puede proceder.");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Información de Envío</h2>
        <form>
          {[
            { label: "Nombre", key: "nombre" },
            { label: "Apellido", key: "apellido" },
            { label: "Dirección (Línea 1)", key: "direccion1" },
            { label: "Dirección (Línea 2)", key: "direccion2" },
            { label: "Código Postal", key: "codigoPostal" },
            { label: "Ciudad/Estado", key: "ciudadEstado" },
            { label: "Teléfono", key: "telefono" },
            { label: "Correo Electrónico", key: "email" },
          ].map(({ label, key }) => (
            <div key={key} className="mb-4">
              <label className="block font-semibold mb-2">{label}:</label>
              <input
                type={key === "email" ? "email" : "text"}
                value={formulario[key as keyof typeof formulario]}
                onChange={(e) =>
                  setFormulario({ ...formulario, [key]: e.target.value })
                }
                className={`w-full p-2 border rounded ${
                  errores[key] ? "border-red-500" : ""
                }`}
              />
              {errores[key] && (
                <p className="text-red-500 text-sm mt-1">{errores[key]}</p>
              )}
            </div>
          ))}

          <div className="mb-4">
            <label className="block font-semibold mb-2">País:</label>
            <select
              value={formulario.pais}
              onChange={(e) =>
                setFormulario({ ...formulario, pais: e.target.value })
              }
              className={`w-full p-2 border rounded ${
                errores.pais ? "border-red-500" : ""
              }`}
            >
              <option value="">Seleccionar país</option>
              {[
                "Afganistán",
                "Alemania",
                "Andorra",
                "Argentina",
                "Brasil",
                "Canadá",
                "Chile",
                "España",
                "Estados Unidos",
                "México",
                "Perú",
                "República Dominicana",
                "Uruguay",
              ].map((pais, index) => (
                <option key={index} value={pais}>
                  {pais}
                </option>
              ))}
            </select>
            {errores.pais && (
              <p className="text-red-500 text-sm mt-1">{errores.pais}</p>
            )}
          </div>
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
            onClick={manejarConfirmar}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
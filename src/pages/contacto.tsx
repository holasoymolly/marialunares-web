export default function Contacto() {
  return (
    <>
      <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center">
        {/* Contenido principal */}
        <main className="text-center">
          <h1 className="text-9xl font-extrabold mb-4 title">CONTACTO</h1>
          <p className="text-lg">estoesmarialunares@gmail.com</p>
        </main>
      </div>

      {/* Estilos */}
      <style jsx>{`
        body {
          margin: 0;
          padding: 0;
        }
        .title {
          font-size: 9rem;
        }

        /* Estilos para dispositivos móviles */
        @media (max-width: 768px) {
          .title {
            font-size: 4rem; /* Tamaño reducido para móviles */
            top: 10vh; /* Ajuste opcional si usas posicionamiento absoluto */
            left: 5vw;
          }
        }
      `}</style>
    </>
  );
}
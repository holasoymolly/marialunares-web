import Head from 'next/head';
import Layout from '@/components/layout';

function Musica() {
  const imageLinks = [
    { url: 'https://link-externo-a-la-imagen1.com', imgSrc: 'images/raices-cuadrado.jpg' },
    { url: 'https://link-externo-a-la-imagen2.com', imgSrc: 'images/raices-cuadrado.jpg' },
    { url: 'https://link-externo-a-la-imagen3.com', imgSrc: 'images/raices-cuadrado.jpg' },
    { url: 'https://link-externo-a-la-imagen4.com', imgSrc: 'images/raices-cuadrado.jpg' },
    { url: 'https://link-externo-a-la-imagen5.com', imgSrc: 'images/raices-cuadrado.jpg' }
  ];

  return (
    <Layout>
      <Head>
        <title>Música - Maria Lunares</title>
      </Head>
      <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white">
        <h1 className="text-4xl font-bold mb-10">Música</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-10 max-w-4xl">
          {imageLinks.slice(0, 2).map((item, index) => (
            <a key={index} href={item.url} target="_blank" rel="noopener noreferrer">
              <img src={item.imgSrc} alt={`Imagen ${index + 1}`}
                className="w-full h-auto object-cover rounded-lg transition duration-300 hover:scale-105"
              />
            </a>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl">
          {imageLinks.slice(2, 5).map((item, index) => (
            <a key={index} href={item.url} target="_blank" rel="noopener noreferrer">
              <img src={item.imgSrc} alt={`Imagen ${index + 3}`}
                className="w-full h-auto object-cover rounded-lg transition duration-300 hover:scale-105"
              />
            </a>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Musica;
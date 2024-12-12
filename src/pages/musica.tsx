import Head from 'next/head';
import Layout from '@/components/layout';

function Musica() {
  const imageLinks = [
    { url: 'https://open.spotify.com/album/1p4NjRE0zZ2VU5liuQ3hXP?si=tO6qU349Sp6KJIk1ESpr-A', imgSrc: 'images/ml-sol-trips-coverart.webp' },
    { url: 'https://open.spotify.com/track/6GKHVLuwE5rwx2f02WX1Cw?si=f34fc1905c6b4fe6', imgSrc: 'images/ml-sol-coverart.webp' },
    { url: 'https://open.spotify.com/track/5S0mbj3MTfEtIyS81vEW3Y?si=17599c4ecfe74663', imgSrc: 'images/ml-sabes-coverart.webp' },
    { url: 'https://open.spotify.com/album/0VGd8TOS3VEt6SORY72aAW?si=nq_euPY4QxibjGXMIyYVUg', imgSrc: 'images/ml-luna-coverart.webp' },
    { url: 'https://open.spotify.com/track/3oanYh0xtkJtAXkz8mynbd?si=ca1eb88ba5f94571', imgSrc: 'images/ml-sombra-coverart.webp' }
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
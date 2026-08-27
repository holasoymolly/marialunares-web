// Genera public/og-image.jpg: la tarjeta que se ve al compartir el sitio en
// WhatsApp, Twitter, Facebook o iMessage.
//
// 1200x630 es el tamaño que esperan todas esas plataformas. La composición
// sigue la estética del sitio: negro, tipografía grande y la foto sangrando por
// la derecha, fundida en el fondo con un degradado.
//
// Uso: node scripts/og-image.mjs
import sharp from "sharp";
import path from "node:path";

const W = 1200;
const H = 630;
const FOTO = "public/images/home/home-poster.webp";
const SALIDA = "public/og-image.jpg";

// La foto ocupa la mitad derecha. El recorte se centra en la cara.
const ANCHO_FOTO = 700;

const FUENTE = "Helvetica Neue, Helvetica, Arial, sans-serif";

const texto = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <text x="72" y="300" font-family="${FUENTE}" font-size="86" font-weight="700"
        letter-spacing="-2.5" fill="#ffffff">Maria Lunares</text>

  <text x="76" y="352" font-family="${FUENTE}" font-size="21" font-weight="500"
        letter-spacing="3.4" fill="#ffffff" opacity="0.82">NEO-BOLERO ESPACIAL</text>
  <text x="76" y="386" font-family="${FUENTE}" font-size="21" font-weight="500"
        letter-spacing="3.4" fill="#ffffff" opacity="0.82">TRIP-HOP Y ELECTRÓNICA</text>

  <rect x="76" y="424" width="46" height="1" fill="#ffffff" opacity="0.35"/>

  <text x="76" y="470" font-family="${FUENTE}" font-size="19" font-weight="400"
        letter-spacing="1.2" fill="#ffffff" opacity="0.55">marialunares.com</text>
</svg>`;

// Degradado que funde el borde izquierdo de la foto con el fondo negro.
const fundido = `
<svg width="${ANCHO_FOTO}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#000000" stop-opacity="1"/>
      <stop offset="42%"  stop-color="#000000" stop-opacity="0.55"/>
      <stop offset="78%"  stop-color="#000000" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${ANCHO_FOTO}" height="${H}" fill="url(#g)"/>
</svg>`;

async function main() {
  const meta = await sharp(FOTO).metadata();

  // Se usa el ancho completo del retrato para no cortar el pelo, y se recorta
  // por abajo: la parte interesante (las gafas de púas) está arriba.
  const altoRec = Math.min(Math.round((meta.width * H) / ANCHO_FOTO), meta.height);
  const foto = await sharp(FOTO)
    .extract({ left: 0, top: 0, width: meta.width, height: altoRec })
    .resize(ANCHO_FOTO, H, { fit: "cover", position: "top" })
    .modulate({ brightness: 1.16 })
    .toBuffer();

  await sharp({
    create: { width: W, height: H, channels: 3, background: "#000000" },
  })
    .composite([
      { input: foto, left: W - ANCHO_FOTO, top: 0 },
      { input: Buffer.from(fundido), left: W - ANCHO_FOTO, top: 0 },
      { input: Buffer.from(texto), left: 0, top: 0 },
    ])
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(SALIDA);

  const out = await sharp(SALIDA).metadata();
  console.log(`  ${SALIDA}  ${out.width}x${out.height}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});

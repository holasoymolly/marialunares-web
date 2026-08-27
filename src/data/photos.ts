// Catálogo de la galería de /fotos.
//
// El texto alternativo vive aquí y no en src/i18n/translations.ts por el mismo
// motivo que el contenido de las canciones: translations.ts guarda las
// etiquetas de interfaz, que son fijas y pocas; esto crece cada vez que se
// añade una sesión de fotos y pertenece al catálogo.
//
// Sobre el alt: describe lo que se ve, no repite "foto de". Lo leen los
// lectores de pantalla y lo indexa Google, así que conviene ser concreto.

export interface Photo {
  /** Ruta dentro de /public (usar siempre imágenes optimizadas). */
  src: string;
  altEs: string;
  altEn: string;
}

export const photos: Photo[] = [
  // --- Sesión de estudio (fondo de color y fondo gris) ---
  {
    src: "/images/fotos/sev/sev_1605.jpg",
    altEs:
      "Maria Lunares de perfil sobre fondo turquesa, con trenzas largas rematadas en cuentas de madera y una chaqueta oscura de estampado dorado.",
    altEn:
      "Maria Lunares in profile against a turquoise backdrop, long braids finished with wooden beads and a dark jacket with a gold print.",
  },
  {
    src: "/images/fotos/sev/sev_1647.jpg",
    altEs:
      "Maria Lunares sostiene un controlador Akai APC40 sobre el hombro, con cortavientos morado, gafas redondas rosas y trenzas con cuentas.",
    altEn:
      "Maria Lunares holds an Akai APC40 controller on her shoulder, wearing a purple windbreaker, round pink sunglasses and beaded braids.",
  },
  {
    src: "/images/fotos/sev/sev_1651.jpg",
    altEs:
      "Plano corto sobre fondo turquesa: el controlador apoyado en el hombro y la mirada hacia abajo tras unas gafas redondas.",
    altEn:
      "Close crop against a turquoise backdrop: the controller resting on her shoulder, eyes down behind round sunglasses.",
  },
  {
    src: "/images/fotos/sev/sev_1668.jpg",
    altEs:
      "Maria Lunares con chaqueta vaquera y el pelo recogido en un moño con cuentas, mirando a cámara por encima del hombro sobre fondo malva.",
    altEn:
      "Maria Lunares in a denim jacket, hair up in a beaded bun, looking back at the camera over her shoulder against a mauve backdrop.",
  },
  {
    src: "/images/fotos/sev/sev_1730.jpg",
    altEs:
      "Camiseta blanca de caritas sonrientes bajo una chaqueta vaquera holgada, collar de conchas y la barbilla alta, sobre fondo malva.",
    altEn:
      "White smiley-print T-shirt under an oversized denim jacket, cowrie shell necklace and chin raised, against a mauve backdrop.",
  },
  {
    src: "/images/fotos/sev/sev1785.jpg",
    altEs:
      "Retrato de cuerpo entero con mono de trabajo azul y botas blancas, sosteniendo de pie una guitarra Fender Mustang roja.",
    altEn:
      "Full-length portrait in a blue boilersuit and white boots, holding a red Fender Mustang guitar upright.",
  },

  // --- Sesión de estudio: las gafas de púas (la mirada de ML) ---
  {
    src: "/images/fotos/sev/sev_1479.webp",
    altEs:
      "Maria Lunares con unas gafas de alambre rematadas en púas que salen como rayos de sol, melena rizada suelta y cuero negro.",
    altEn:
      "Maria Lunares wearing wire glasses spiked like sun rays, curly hair loose and black leather.",
  },
  {
    src: "/images/fotos/sev/sev_1483.webp",
    altEs:
      "De tres cuartos, con las gafas de púas y una capa corta de cuero negro, las manos cruzadas a la altura de la cintura.",
    altEn:
      "Three-quarter view wearing the spiked glasses and a short black leather cape, hands crossed at the waist.",
  },
  {
    src: "/images/fotos/sev/sev_1494.webp",
    altEs:
      "Cuerpo entero de negro sobre fondo gris, con las gafas de púas y las palmas abiertas hacia los lados.",
    altEn:
      "Full-length in black against a grey backdrop, wearing the spiked glasses with palms open at her sides.",
  },
  {
    src: "/images/fotos/sev/sev_1515.webp",
    altEs:
      "En cuclillas sobre un cubo blanco, vestida de negro y con las gafas de púas, mirando directamente a cámara.",
    altEn:
      "Crouched on a white plinth, dressed in black and wearing the spiked glasses, looking straight at the camera.",
  },
  {
    src: "/images/fotos/sev/sev_1535.webp",
    altEs:
      "Camisa negra abierta sobre camiseta, medio moño y las gafas de púas, con la cabeza inclinada y las manos en los bolsillos.",
    altEn:
      "Open black shirt over a tee, half-up bun and the spiked glasses, head tilted down and hands in her pockets.",
  },

  // --- Retratos: pintura de luz y blanco y negro ---
  {
    src: "/images/fotos/retratos/img_9620.jpg",
    altEs:
      "Silueta recortada contra una espiral de estelas de luz azul y verde, hecha con exposición larga.",
    altEn:
      "Silhouette against a spiral of blue and green light trails, shot with a long exposure.",
  },
  {
    src: "/images/fotos/retratos/img_9641.jpg",
    altEs:
      "Exposición larga: silueta con una guitarra eléctrica mientras las estelas de luz azul y roja recorren el cuerpo.",
    altEn:
      "Long exposure: a silhouette with an electric guitar as blue and red light trails run across the body.",
  },
  {
    src: "/images/fotos/retratos/img_9644.jpg",
    altEs:
      "Tocando la guitarra entre trazos de luz azul y magenta que cruzan el encuadre en exposición larga.",
    altEn:
      "Playing guitar amid blue and magenta light streaks crossing the frame in a long exposure.",
  },
  {
    src: "/images/fotos/retratos/img_9645.jpg",
    altEs:
      "Silueta con los brazos levantados sobre la cabeza, envuelta en hilos de luz azul que caen como lluvia.",
    altEn:
      "Silhouette with arms raised overhead, wrapped in threads of blue light falling like rain.",
  },
  {
    src: "/images/fotos/retratos/img_9676.jpg",
    altEs:
      "Blanco y negro: el pelo rizado cruzado sobre la cara en pleno movimiento, contra una pared clara.",
    altEn:
      "Black and white: curly hair thrown across her face mid-movement, against a pale wall.",
  },
  {
    src: "/images/fotos/retratos/img_9680.jpg",
    altEs:
      "Blanco y negro: camisa de rayas contra una pared, el brazo extendido y una sombra de celosía proyectada a su lado.",
    altEn:
      "Black and white: a striped shirt against a wall, one arm outstretched and a lattice shadow cast beside her.",
  },

  // --- Raíces: detrás de cámaras (blanco y negro, dobles exposiciones) ---
  {
    src: "/images/fotos/raices-bts/raices-bts-3.jpg",
    altEs:
      "Doble exposición del rodaje de Raíces: cantando al micrófono mientras toca la guitarra sobre un controlador Akai APC40.",
    altEn:
      "Double exposure from the Raíces shoot: singing into the mic while playing guitar over an Akai APC40 controller.",
  },
  {
    src: "/images/fotos/raices-bts/raices-bts-4.jpg",
    altEs:
      "Una bailarina salta descalza con un traje de flecos mientras Maria Lunares toca la guitarra junto a la pared del ensayo.",
    altEn:
      "A dancer leaps barefoot in a fringed costume while Maria Lunares plays guitar by the rehearsal room wall.",
  },
  {
    src: "/images/fotos/raices-bts/raices-bts-6.jpg",
    altEs:
      "Doble exposición: Maria Lunares de pie ante su equipo (portátil, controlador y guitarra) con un cámara al borde del encuadre.",
    altEn:
      "Double exposure: Maria Lunares standing at her rig (laptop, controller and guitar) with a camera operator at the edge of frame.",
  },
  {
    src: "/images/fotos/raices-bts/raices-bts-9.jpg",
    altEs:
      "Doble exposición a través de una ventana: mirando hacia el equipo, con camiseta teñida, un monitor de estudio y pedales alrededor.",
    altEn:
      "Double exposure through a window: looking down at the gear in a tie-dye top, a studio monitor and pedals around her.",
  },
  {
    src: "/images/fotos/raices-bts/raices-bts-20.jpg",
    altEs:
      "Doble exposición: Maria Lunares al controlador y, superpuesta e invertida, la bailarina con el traje de flecos.",
    altEn:
      "Double exposure: Maria Lunares at the controller with the fringed dancer superimposed upside down.",
  },
  {
    src: "/images/fotos/raices-bts/raices-bts-22.jpg",
    altEs:
      "La bailarina alza los brazos con el top de flecos mientras Maria Lunares toca al fondo, junto al soporte del teclado.",
    altEn:
      "The dancer raises her arms in the fringed top while Maria Lunares plays at the back, beside the keyboard stand.",
  },
  {
    src: "/images/fotos/raices-bts/raices-bts-28.jpg",
    altEs:
      "Doble exposición de la sala: la bailarina sentada en el suelo con los brazos en alto y Maria Lunares tocando al fondo.",
    altEn:
      "Double exposure of the room: the dancer sitting on the floor with her arms up and Maria Lunares playing at the back.",
  },
  {
    src: "/images/fotos/raices-bts/raices-bts-31.jpg",
    altEs:
      "La bailarina con el top de flecos blancos en primer plano y Maria Lunares detrás, con mono azul y guitarra roja.",
    altEn:
      "The dancer in the white fringed top in the foreground and Maria Lunares behind her, in a blue boilersuit with a red guitar.",
  },
  {
    src: "/images/fotos/raices-bts/raices-bts-39.jpg",
    altEs:
      "Plano cenital de Maria Lunares tocando la guitarra sobre el controlador, con el pelo cubriéndole la cara y el micrófono al lado.",
    altEn:
      "Overhead shot of Maria Lunares playing guitar over the controller, hair covering her face and the mic to one side.",
  },
  {
    src: "/images/fotos/raices-bts/raices-bts-54.jpg",
    altEs:
      "Doble exposición: la bailarina de rodillas en un haz de luz con las manos en la cabeza y Maria Lunares detrás, al micrófono.",
    altEn:
      "Double exposure: the dancer kneeling in a shaft of light with her hands to her head and Maria Lunares behind her at the mic.",
  },
  {
    src: "/images/fotos/raices-bts/raices-bts-57.jpg",
    altEs:
      "Plano general de la sala: la bailarina en vertical sobre la cabeza y Maria Lunares tocando junto a la pared del fondo.",
    altEn:
      "Wide shot of the room: the dancer in a headstand and Maria Lunares playing against the far wall.",
  },
];

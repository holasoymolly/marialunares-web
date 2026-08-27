# Compra de varios releases a la vez

[← back to CLAUDE.md](../CLAUDE.md)

> **Estado: aparcado.** Analizado el 27 de agosto de 2026, sin implementar. La
> web sigue con un botón de compra por release.
>
> Lemon Squeezy podría añadir carrito en cualquier momento: **volver a verificar
> antes de actuar sobre este documento.**

## La pregunta

¿Se puede montar un carrito en la web para que alguien compre varias canciones
en una sola operación?

## Lo que permite Lemon Squeezy hoy

**No tiene carrito.** Un checkout equivale a **un producto**. Es su función más
pedida y lleva años en la lista de peticiones sin implementarse
([nolt #4](https://lemonsqueezy.nolt.io/4),
[nolt #672](https://lemonsqueezy.nolt.io/672)).

Sí permite, sin código:

- **Cantidad** sobre un mismo producto
  ([docs](https://docs.lemonsqueezy.com/help/checkout/setting-a-quantity)).
- **Códigos de descuento.**
- **Precio personalizado** al crear un checkout por API
  ([docs](https://docs.lemonsqueezy.com/api/checkouts/create-checkout)).

## Por qué importa: el coste

Lemon Squeezy cobra **5% + $0,50 por transacción**
([referencia](https://getstacksmart.com/blog/lemon-squeezy-merchant-of-record-fees-2026)).
Ese medio dólar fijo se paga en **cada** compra, así que separar las compras
penaliza mucho en artículos baratos.

Ejemplo con tres releases a $5:

| | Comisión | Queda |
|---|---|---|
| Tres compras separadas | $2,25 · **15,0%** | $12,75 |
| Una compra de $15 | $1,25 · **8,3%** | $13,75 |

Un dólar por cliente, y con menos fricción.

## Las tres vías

### A. Bundles en Lemon Squeezy — la recomendada

Crear productos adicionales que agrupen archivos: «Discografía completa» con las
cinco, y opcionalmente «Los dos EPs» (De Noche + Sol: Trips).

- **Coste adicional:** ninguno, las mismas comisiones.
- **Trabajo:** crear el producto y subir los archivos (Molly) · un bloque y un
  botón en `/musica` (código).
- **Límite:** combinaciones fijas, no «elige las que quieras».

### B. Carrito real con la API — descartada por ahora

Se puede crear por API un checkout con precio personalizado y fusionar varios
artículos en una sola línea sintética.

**El problema que lo tumba:** Lemon Squeezy entrega **los archivos del producto
al que apunta el checkout**. Si se fusionan cinco canciones en una línea
inventada, quien compre recibe los archivos de una sola.

Habría que **entregar los archivos por cuenta propia**: alojar los WAV y MP3,
escuchar el webhook de compra, generar enlaces firmados y temporales, y guardar
los pedidos. Eso convierte una web estática en una aplicación con backend y
datos de clientes, con lo que arrastra: seguridad, copias, protección de datos.

Días de trabajo y mantenimiento permanente. Desproporcionado para cinco releases.

### C. Bandcamp

Ya están las cinco allí y **Bandcamp sí tiene carrito**. Cero trabajo, pero
comisión más alta y saca a la persona de la web, que va en contra del «sin
intermediarios» de `/sobre`.

## Recomendación

**La A.** Con cinco releases, quien quiere varias casi siempre las quiere
**todas**: un bundle de discografía cubre ese caso, y uno de «los dos EPs» cubre
casi todo lo demás. Un carrito dinámico es mucha maquinaria para un caso poco
frecuente.

## Qué haría falta para montar la A

1. Molly crea el producto en Lemon Squeezy con los archivos de las cinco y pasa
   la URL de checkout.
2. En el código:
   - Un tercer tipo en el catálogo, junto a sencillo (`lyrics`) y disco
     (`tracks[]`): un **bundle** que referencia varios slugs.
   - Un bloque en `/musica` con la portada del pack y su botón.
   - Una mención al cierre de cada página de release: «o llévate la discografía
     completa».
   - Opcionalmente su propia página, `/musica/discografia`.

## Alternativa sin código, mientras tanto

Un código de descuento anunciado en `/musica` («llévate dos o más con el código
X»). Siguen siendo compras separadas, así que no ahorra los $0,50 fijos, pero sí
premia comprar más.

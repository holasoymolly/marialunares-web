# La tienda de artículos físicos

[← back to CLAUDE.md](../CLAUDE.md)

> **Estado: bloqueada, decisión pendiente.** Analizado el 28 de agosto de 2026.
> La tienda de Printful sigue enlazada desde el menú, pero **no puede venderle a
> nadie fuera de Estados Unidos**. Retomar en la próxima sesión.

Este documento es solo sobre la tienda de **artículos físicos** (Printful).
La venta de música digital (Lemon Squeezy, `checkoutUrl` por release) no entra
aquí y no se toca; para la compra de varios releases a la vez ver
[CARRITO.md](CARRITO.md).

## El hallazgo

`marialunares.printful.me` es una **Printful Quick Store**. Comprobado en su
checkout el 28-08-2026: el desplegable de **País tiene una sola opción, United
States**.

Printful lo dice en su propia página de producto: Quick Stores está *"only
available to merchants with tax residency in the US and shoppers with a shipping
address in the US"* ([printful.com/quick-stores](https://www.printful.com/quick-stores)).

**Nadie en España, Europa o Latinoamérica puede comprar nada.** No es que venda
poco: es que el checkout los rechaza.

Mientras eso siga así, todo lo demás (precios, fotos, catálogo) es secundario.

## Qué más se vio, ya que estábamos

| Problema | Detalle |
|---|---|
| Solo envía a EE.UU. | El bloqueo de arriba. Es el único que importa hoy. |
| Todo en inglés y en dólares | El sitio es español-primero por convención; la tienda se la salta entera. |
| Descripciones de fábrica | Texto por defecto de Printful ("Master your urban look with an oversized t-shirt…"), no la voz del proyecto. |
| Mockups de stock | Modelos genéricos de Printful. No hay ninguna foto propia. |
| Catálogo genérico | 10 productos: gorro waffle, tie-dye, bucket hat, gorra… Lo único propio son las de portada (Asfalto, S0L, Raíces). |
| Precios altos | Tee oversized a $50, sudadera a $80. Ni barato ni con calidad que lo justifique. |
| Producto agotado | "Alien Face Tee": todas las tallas (S–4XL) bloqueadas, botón muerto. |
| Plantilla por defecto | Blanca, sin relación visual con el sitio (negro, video, cinematográfico). |
| Sin dominio propio | Quick Stores no admite dominio personalizado: se queda en `printful.me`. |

## Las opciones

### A. Printful como fábrica + una tienda de verdad — la recomendada

Se abandona Quick Stores y se conecta la cuenta de Printful a una tienda propia.

- **Escaparate:** **Big Cartel** (gratis hasta 5 productos, que es justo lo que
  debería haber) o Shopify (~29 €/mes) si se quiere crecer.
- **Por qué Printful sigue teniendo sentido:** tiene centro de producción en
  **Barcelona**, así que un pedido español se imprime y se envía dentro de
  España — sin aduanas ni esperas largas.
- **Se gana:** envíos a Europa, euros, español, dominio propio
  (`tienda.marialunares.com`), fotos propias en vez de mockups.
- **Coste:** cero o casi. **Trabajo:** una tarde.

### B. Fourthwall — plausible, pero añade plataforma

Plan gratis, storefront con dominio propio, y actúa de *merchant of record*: te
gestiona el IVA, que estando en España no es poco. Pensada para creadores.

En contra: muy centrada en EE.UU., cobra en dólares con recargo de conversión, y
sería una **tercera** plataforma que mantener junto a Lemon Squeezy y Kit.

### C. Gelato — descartada por ahora

10–20% más barata de base que Printful y produce localmente en 32 países, pero
**no tiene tienda propia**: hace falta Shopify igualmente. Solo compensa con un
volumen que hoy no existe.

## Recomendación

**La A.** Mismo proveedor que ya se conoce, arreglado el bloqueo de país, coste
cero o casi, y sin sumar plataformas.

**Y mientras tanto: quitar "Tienda" del menú.** Un enlace visible a una tienda
que rechaza a sus compradores es peor que no tener tienda. Se saca del nav y del
redirect hasta que A esté montada.

## Pendiente de confirmar antes de mover nada

**¿Hay residencia fiscal en EE.UU.?** Si la hubiera, Quick Stores sería legítima
y solo habría que revisar por qué no ofrece envío internacional. Se da por hecho
que no, pero conviene confirmarlo.

## Lo de "productos cool y diferentes"

No lo arregla ninguna plataforma: es el producto. Con print-on-demand se vende
una camiseta de algodón estampada en digital — está bien, pero no es distinta ni
comunica calidad, y deja ~8–10 € de 30.

Lo que sí encaja, **cuando la tienda ya funcione**:

- **Tirada corta serigrafiada** (30–50 unidades, numeradas) en un taller español.
  Coste unitario mucho menor y calidad real. Riesgo: se paga por adelantado y se
  almacena y envía uno mismo.
- **Casete numerado** con la portada como arte. Se fabrica desde 25 unidades y
  hay fabricantes en España (Press Your Beat en Gandía, Discosville en Algemesí).
- **Print de una portada**, firmado y numerado. Margen alto y encaja con la parte
  visual del proyecto.

Eso se vende como **drop ligado a un release**, no como catálogo permanente. Para
físico, Bandcamp ya tiene carrito y cobra 10%, y las cinco canciones ya están
allí — sin tocar nada de Lemon Squeezy.

## Para decidir con datos

El 28-08-2026 se instaló **Vercel Web Analytics** (`@vercel/analytics` en
`src/pages/_app.tsx`), que hasta entonces no existía: no había ninguna analítica
en el proyecto.

Ojo: la cuenta de Vercel está en plan **Hobby**, y los *custom events* solo van
en Pro. Así que hay visitas por página (cuánta gente llega a `/musica`, a cada
canción), pero **no** se puede medir el clic saliente hacia la tienda.

## Fuentes

- [Printful Quick Stores](https://www.printful.com/quick-stores) — la restricción a EE.UU.
- [Printful vs Gelato / alternativas 2026](https://ecommerce-platforms.com/print-on-demand/printful-alternatives)
- [Precios de Fourthwall](https://ecomm.design/fourthwall-pricing/)
- [Comisiones de Bandcamp](https://get.bandcamp.help/en/articles/15263193-what-are-bandcamp-s-fees)
- [Fabricación de casete y vinilo en España](https://vinylrecordpress.media/collection/spain/)
- [Vercel Web Analytics: precios y límites](https://vercel.com/docs/analytics/limits-and-pricing)

import { ReactNode, useEffect, useRef, useState } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
}

// Lo fijo de la página que tapa el contenido al hacer scroll: el menú y el logo
// arriba, y el newsletter, el reproductor y las redes abajo. Se mide en cada
// carga y al cambiar el tamaño, así sirve en cualquier pantalla.
// Lo que lleva data-reveal-ignore (el título de /musica) no cuenta: se monta
// sobre las portadas a propósito.
function fixedRects(): DOMRect[] {
  return Array.from(document.body.querySelectorAll<HTMLElement>("*"))
    .filter((el) => !el.closest("[data-reveal-ignore]") && getComputedStyle(el).position === "fixed")
    .map((el) => el.getBoundingClientRect())
    .filter((r) => r.width > 0 && r.height > 0);
}

// Franja libre: entre lo fijo de arriba (logo y menú) y lo fijo de abajo
// (newsletter, reproductor y redes) que quede encima de la columna de portadas
// o a menos de NEAR px de ella. En móvil el menú pasa casi pegado a la columna
// y cuenta; en escritorio queda lejos y la columna usa toda la altura.
// La columna es el ancestro con data-reveal-zone (la galería entera, para que
// las dos columnas de portadas se comporten igual).
const NEAR = 48;
function rootMargin(el: HTMLElement): string {
  const zone = (el.closest("[data-reveal-zone]") as HTMLElement | null) ?? el;
  const box = zone.getBoundingClientRect();
  const h = window.innerHeight;
  let top = h * 0.08;
  let bottom = h * 0.08;
  for (const r of fixedRects()) {
    if (r.right < box.left - NEAR || r.left > box.right + NEAR) continue;
    if (r.top < h * 0.4) top = Math.max(top, r.bottom + 12);
    else if (r.bottom > h * 0.6) bottom = Math.max(bottom, h - r.top + 12);
  }
  return `-${Math.round(top)}px 0px -${Math.round(bottom)}px 0px`;
}

// Aparece al entrar por abajo y se desvanece al salir por arriba, dentro de la
// franja que no tapa lo fijo de la página.
//
// Empieza visible: sin JS (o antes de hidratar) las portadas se ven igual.
export default function Reveal({ children, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  // "in": en pantalla · "below": aún no ha llegado · "above": ya pasó por arriba.
  const [state, setState] = useState<"in" | "below" | "above">("in");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let observer: IntersectionObserver | null = null;
    const observe = () => {
      observer?.disconnect();
      observer = new IntersectionObserver(
        ([entry]) => {
          // Por abajo entra cuando ya cabe entera (no asoma tras los botones).
          // Por arriba se va cuando más de la mitad pasó bajo el menú: así la
          // primera portada, que arranca casi pegada al menú, se ve al cargar.
          const top = entry.rootBounds?.top ?? 0;
          const arriba = entry.boundingClientRect.top < top;
          const minimo = arriba ? 0.5 : 0.97;
          if (entry.intersectionRatio >= minimo) return setState("in");
          setState(arriba ? "above" : "below");
        },
        { rootMargin: rootMargin(el), threshold: [0, 0.25, 0.5, 0.75, 0.97] }
      );
      observer.observe(el);
    };

    observe();
    window.addEventListener("resize", observe);
    return () => {
      window.removeEventListener("resize", observe);
      observer?.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: state === "in" ? 1 : 0,
        transform:
          state === "in"
            ? "none"
            : `translateY(${state === "below" ? "2.5rem" : "-2.5rem"}) scale(0.97)`,
        transition: "opacity 700ms ease, transform 700ms cubic-bezier(0.2, 0.7, 0.2, 1)",
      }}
    >
      {children}
    </div>
  );
}

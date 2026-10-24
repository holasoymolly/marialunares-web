import { ReactNode, useEffect, useRef, useState } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
}

// Aparece al entrar por abajo y se desvanece al salir por arriba. El margen
// negativo del observer hace que el cambio ocurra un poco antes de los bordes
// de la pantalla, para que se vea pasar y no cortarse.
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) return setState("in");
        const top = entry.rootBounds?.top ?? 0;
        setState(entry.boundingClientRect.top < top ? "above" : "below");
      },
      { rootMargin: "-12% 0px -8% 0px", threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
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

import { useEffect, useId, useRef } from "react";
import { Icon } from "@iconify/react";
import NewsletterForm from "./NewsletterForm";
import { useTranslations } from "@/i18n/useTranslations";

interface NewsletterModalProps {
  open: boolean;
  onClose: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Panel modal con el formulario de newsletter. Se cierra con Esc, con el
// botón de cierre o pulsando fuera; el foco queda atrapado dentro mientras
// está abierto y vuelve al botón que lo abrió al cerrarse.
export default function NewsletterModal({ open, onClose }: NewsletterModalProps) {
  const { t } = useTranslations();
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const headingId = useId();

  useEffect(() => {
    if (!open) return;

    lastFocused.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      lastFocused.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      {/* Fondo: cerrar al pulsar fuera. El teclado usa Esc o el botón de cierre. */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="newsletter-panel relative w-full max-w-md rounded-lg border border-white/15 bg-black p-8 text-white shadow-2xl sm:p-10"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t.newsletter.close}
          className="absolute right-4 top-4 rounded-full p-2 opacity-70 transition duration-300 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <Icon icon="mdi:close" className="text-xl" aria-hidden="true" />
        </button>

        <h2 id={headingId} className="max-w-[16ch] text-2xl font-bold leading-tight sm:text-3xl">
          {t.newsletter.heading}
        </h2>
        <p className="mt-3 text-sm leading-relaxed opacity-70">{t.newsletter.subtext}</p>

        <div className="mt-7">
          <NewsletterForm autoFocus />
        </div>
      </div>

      <style jsx>{`
        .newsletter-panel {
          animation: newsletter-in 260ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes newsletter-in {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

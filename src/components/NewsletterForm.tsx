import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useTranslations } from "@/i18n/useTranslations";

type Status = "idle" | "loading" | "success" | "error";

interface NewsletterFormProps {
  /** Enfoca el campo al montar (lo usa el modal al abrirse). */
  autoFocus?: boolean;
}

// Formulario de alta en la newsletter. Habla solo con /api/subscribe;
// la API key de Kit nunca sale del servidor.
export default function NewsletterForm({ autoFocus = false }: NewsletterFormProps) {
  const { t } = useTranslations();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  // El foco se mueve al campo cuando el formulario aparece dentro del modal.
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(`subscribe failed: ${res.status}`);
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      // Devolvemos el foco al campo para que se pueda reintentar sin ratón.
      inputRef.current?.focus();
    }
  }

  const message = status === "success" ? t.newsletter.success : status === "error" ? t.newsletter.error : "";

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* El modal se queda con título, campo y botón; la etiqueta sigue ahí
          para lectores de pantalla. */}
      <label htmlFor={inputId} className="sr-only">
        {t.newsletter.emailLabel}
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={inputId}
          ref={inputRef}
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          required
          autoComplete="email"
          placeholder={t.newsletter.placeholder}
          disabled={status === "loading"}
          className="w-full flex-1 rounded-full border border-white/40 bg-transparent px-5 py-2.5 text-sm text-white placeholder:text-white/50 transition duration-300 focus:border-white focus:outline-none disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className="whitespace-nowrap rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition duration-300 hover:bg-white/85 active:scale-[0.98] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          {status === "loading" ? t.newsletter.loading : t.newsletter.button}
        </button>
      </div>

      {/* El estado se anuncia a lectores de pantalla sin robar el foco. */}
      <p
        role="status"
        aria-live="polite"
        className={`mt-4 min-h-[1.25rem] text-sm ${status === "error" ? "text-white" : "opacity-80"}`}
      >
        {message}
      </p>
    </form>
  );
}

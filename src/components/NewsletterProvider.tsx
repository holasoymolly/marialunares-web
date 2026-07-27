import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import NewsletterModal from "./NewsletterModal";

interface NewsletterContextValue {
  openNewsletter: () => void;
}

const NewsletterContext = createContext<NewsletterContextValue>({
  openNewsletter: () => {},
});

/** Abre el modal de newsletter desde cualquier punto del árbol. */
export function useNewsletter(): NewsletterContextValue {
  return useContext(NewsletterContext);
}

// Un solo modal para todo el sitio: lo abren tanto el botón del Layout como
// la CTA de las páginas de release.
export function NewsletterProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openNewsletter = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ openNewsletter }), [openNewsletter]);

  return (
    <NewsletterContext.Provider value={value}>
      {children}
      <NewsletterModal open={open} onClose={close} />
    </NewsletterContext.Provider>
  );
}

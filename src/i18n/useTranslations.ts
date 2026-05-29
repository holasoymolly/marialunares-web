import { useRouter } from "next/router";
import { translations, DEFAULT_LOCALE, type Locale } from "./translations";

// Devuelve el diccionario para el locale activo y el locale actual.
export function useTranslations() {
  const { locale } = useRouter();
  const current = (locale as Locale) ?? DEFAULT_LOCALE;
  return { t: translations[current] ?? translations[DEFAULT_LOCALE], locale: current };
}

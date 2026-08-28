import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/next";
import Layout from "@/components/layout";
import { NewsletterProvider } from "@/components/NewsletterProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NewsletterProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      {/* Analítica de Vercel: visitas por página, sin cookies ni datos personales. */}
      <Analytics />
    </NewsletterProvider>
  );
}

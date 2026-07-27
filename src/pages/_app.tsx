import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/layout";
import { NewsletterProvider } from "@/components/NewsletterProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NewsletterProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </NewsletterProvider>
  );
}

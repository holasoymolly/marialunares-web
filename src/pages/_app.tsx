import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/layout"; // Importa el layout
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    console.log("Checking CSS variables:");
    console.log("--logo-default:", getComputedStyle(document.documentElement).getPropertyValue("--logo-default"));
    console.log("--logo-hover:", getComputedStyle(document.documentElement).getPropertyValue("--logo-hover"));
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
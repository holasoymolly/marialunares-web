import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/layout";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function App({ Component, pageProps }: AppProps) {
  // Opciones de configuración para PayPal
  const paypalOptions = {
    clientId: "AZSlCtnupa2QIPvlRJINBPNIpUZSGD83prPQ4Z7M0JyMkCthODQM1gbLg_JjGKMc_hB027-Tr4PPvLBG", // Usa camelCase
    currency: "USD",
  };

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </PayPalScriptProvider>
  );
}
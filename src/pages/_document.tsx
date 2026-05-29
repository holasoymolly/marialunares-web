import { Html, Head, Main, NextScript, type DocumentProps } from "next/document";

export default function Document(props: DocumentProps) {
  // El locale activo viaja en __NEXT_DATA__ cuando i18n está configurado.
  const locale = props.__NEXT_DATA__?.locale ?? "es";
  return (
    <Html lang={locale}>
      <Head>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

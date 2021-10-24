import "../styles/globals.css";
import type { AppProps } from "next/app";
import { VechaiProvider } from "@vechaiui/react";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <VechaiProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </VechaiProvider>
  );
}
export default MyApp;

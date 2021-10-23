import "../styles/globals.css";
import type { AppProps } from "next/app";
import { VechaiProvider } from "@vechaiui/react";
import { RecoilRoot } from "recoil";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <VechaiProvider>
      <RecoilRoot>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RecoilRoot>
    </VechaiProvider>
  );
}
export default MyApp;

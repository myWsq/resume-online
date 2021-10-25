import "../styles/globals.css";
import type { AppProps } from "next/app";
import { VechaiProvider } from "@vechaiui/react";
import Layout from "../components/Layout";
import { RecoilRoot } from "recoil";

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

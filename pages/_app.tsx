// These styles apply to every route in the application
import "@/app/globals.css";
import Layout from "../components/layout/Layout";
import { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

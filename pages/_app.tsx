// These styles apply to every route in the application
import "@/app/globals.css";
import Layout from "../components/layout/Layout";
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
    </SessionProvider>
  );
}

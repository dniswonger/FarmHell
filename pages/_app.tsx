// These styles apply to every route in the application
import "@/app/globals.css";
import Layout from "../components/layout/Layout";
import { AppProps } from "next/app";
import { ClerkProvider } from '@clerk/nextjs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TextureProvider from '@/hooks/TextureProvider/TextureProvider'

const queryClient = new QueryClient()
const textureMap = new Map<string, string>()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <TextureProvider map={textureMap}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </TextureProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

// These styles apply to every route in the application
import "@/app/globals.css";
import Layout from "../components/layout/Layout";
import { AppProps } from "next/app";
import { ClerkProvider } from '@clerk/nextjs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TextureProvider from '@/hooks/TextureProvider/TextureProvider'
import { useRouter } from "next/router";
import { Bokor, Roboto } from 'next/font/google'

const queryClient = new QueryClient()
const textureMap = new Map<string, string>()

export const bokor = Bokor({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bokor',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-roboto',
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {

  const router = useRouter()

  //this *should* be done with per-page layouts (or possibly route groups if we were using app router). But since we only need 
  // these two pages to not have a layout, this will work for now.
  const getCoreComponent = () => {
    if (router.pathname.startsWith('/sign-in') || router.pathname.startsWith('/sign-up')) {
      return (
        <Component {...pageProps} />
      )
    }
    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    )
  }

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <TextureProvider map={textureMap}>
          <main className={`${roboto.variable} ${bokor.variable} font-sans relative h-full`}>
            {getCoreComponent()}
          </main>
        </TextureProvider>
      </QueryClientProvider>
    </ClerkProvider>
  )
}

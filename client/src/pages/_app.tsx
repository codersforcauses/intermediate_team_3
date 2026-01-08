import "@/styles/globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import { Navbar } from "@/components/ui/navbar";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const noNavbarRoutes = ["/login", "/register", "/"];
  const showNavbar = !noNavbarRoutes.includes(router.pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {showNavbar && <Navbar />}
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

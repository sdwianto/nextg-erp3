// pages/_app.tsx
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import "@/styles/globals.css";
import type { NextPage } from "next";
import { type AppProps } from "next/app";
import { Outfit } from "next/font/google";
import type { ReactElement, ReactNode } from "react";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { api } from "@/utils/api";
import superjson from "superjson";

const outfit = Outfit({
  subsets: ["latin"],
});

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  const [mounted, setMounted] = useState(false);

  // tRPC setup dengan optimasi caching - ENHANCED
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 2 * 60 * 1000, // 2 menit - reduced for more responsive data
        gcTime: 5 * 60 * 1000, // 5 menit - reduced for better memory management
        retry: 2, // Increased retry for better reliability
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true, // Refetch on reconnect
        // Performance optimizations
        refetchInterval: false, // Disable automatic refetching
        refetchIntervalInBackground: false,
        // Network optimizations
        networkMode: 'online',
        // Cache optimizations
        structuralSharing: true,
        // Error handling
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        retry: 1,
        retryDelay: 1000,
        networkMode: 'online',
      },
    },
  }));
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
        }),
      ],
    })
  );

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch - show loading state
  if (!mounted) {
    return (
      <div className={`${outfit.className} flex h-screen w-screen items-center justify-center bg-gray-50 dark:bg-gray-900`}>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">NextGen ERP</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <div className={`${outfit.className}`}>
            {getLayout(<Component {...pageProps} />)}
            <Toaster position="top-right" />
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    </api.Provider>
  );
};

export default MyApp;
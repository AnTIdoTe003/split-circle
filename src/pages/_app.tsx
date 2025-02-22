import { trpc } from "@/utils/trpc";
import { httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProps } from "next/app";
import SuperJSON from "superjson";
import "@/styles/globals.css";
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {

    return (
    <trpc.Provider
      client={trpc.createClient({
        links: [
          httpBatchLink({
            url: "/api/trpc",
            transformer: SuperJSON
          }),
        ],
      })}
      queryClient={queryClient}
    >
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default MyApp;

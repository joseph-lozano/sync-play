import "~/styles/globals.css";
import type { AppProps } from "next/app";
import { trpc } from "~/lib/trpc";
import { ObjectPoolProvider } from "~/components/contexts/object-pool";

function App({ Component, pageProps }: AppProps) {
  return (
    <ObjectPoolProvider>
      <Component {...pageProps} />
    </ObjectPoolProvider>
  );
}
export default trpc.withTRPC(App);

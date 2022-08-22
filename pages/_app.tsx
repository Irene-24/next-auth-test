import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider, useSession } from "next-auth/react";

//fetch new session every 4hrs/30mins
const refetchIntervalSecs = 60 * 60 * 4.5;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider
      refetchInterval={refetchIntervalSecs}
      refetchOnWindowFocus={true}
      session={pageProps.session}
    >
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;

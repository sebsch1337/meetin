import Head from "next/head";

import { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import Layout from "./_layout";
import { RouterTransition } from "@/components/RouterTransition";

import { SessionProvider } from "next-auth/react";

const App: React.FC<AppProps> = (props) => {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props;

  return (
    <>
      <Head>
        <title>MeetIn</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <meta name="description" content="Meetup planning tool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "dark",
        }}
      >
        <Notifications autoClose={2000} />
        <RouterTransition />
        <SessionProvider session={session}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SessionProvider>
      </MantineProvider>
    </>
  );
};

export default App;

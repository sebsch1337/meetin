import Head from "next/head";

import { AppProps } from "next/app";
import { LoadingOverlay, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import Layout from "./_layout";
import { RouterTransition } from "@/components/RouterTransition";

import { SessionProvider, useSession } from "next-auth/react";

export default function App(props: AppProps) {
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
          {
            // @ts-ignore
            Component.auth === "Login" ? (
              <>
                {console.log(Component.name)}
                <Component {...pageProps} />
              </>
            ) : (
              <Auth>
                <Layout>
                  {console.log(Component.name)}

                  <Component {...pageProps} />
                </Layout>
              </Auth>
            )
          }
        </SessionProvider>
      </MantineProvider>
    </>
  );
}

function Auth({ children }: { children: any }) {
  const { status } = useSession({ required: true });

  if (status === "loading") return <LoadingOverlay visible={true} />;

  return children;
}

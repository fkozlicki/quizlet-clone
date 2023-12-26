import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import type { NextPage } from "next";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";
import Layout from "../components/layout/Layout";
import AuthDropdownProvider from "../contexts/AuthDropdownContext";
import FolderModalProvider from "../contexts/FolderModalContext";
import "../styles/globals.css";
import { api } from "../utils/api";
import FlashcardModalProvider from "../contexts/FlashcardModalContext";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<{ session: Session | null }> & {
  Component: NextPageWithLayout;
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={session}>
      <ConfigProvider>
        <AuthDropdownProvider>
          <FolderModalProvider>
            <FlashcardModalProvider>
              <Layout>
                <DefaultSeo
                  title="Quizlet 2.0"
                  description="Quizlet Clone app built with T3Stack"
                  openGraph={{
                    type: "website",
                    locale: "en_IE",
                    url: process.env.NEXT_PUBLIC_APP_DOMAIN,
                  }}
                />
                {getLayout(<Component {...pageProps} />)}
              </Layout>
            </FlashcardModalProvider>
          </FolderModalProvider>
        </AuthDropdownProvider>
      </ConfigProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

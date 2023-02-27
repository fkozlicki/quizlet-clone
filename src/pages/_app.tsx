import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "../utils/api";
import "../styles/globals.css";
import Layout from "../components/layout/Layout";
import { DefaultSeo } from "next-seo";
import AuthDropdownProvider from "../contexts/AuthDropdownContext";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <AuthDropdownProvider>
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
          <Component {...pageProps} />
        </Layout>
      </AuthDropdownProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

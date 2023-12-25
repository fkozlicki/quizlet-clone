import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Hero from "../components/pages/home/Hero";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/latest",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const Home = () => {
  return (
    <>
      <NextSeo title="Quizlet 2.0" />
      <Hero />
    </>
  );
};

export default Home;

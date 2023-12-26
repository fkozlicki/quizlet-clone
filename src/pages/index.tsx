import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useAuthDropdownContext } from "../contexts/AuthDropdownContext";
import { Button } from "antd";

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
  const [, dispatch] = useAuthDropdownContext();

  return (
    <>
      <NextSeo title="Quizlet 2.0" />
      <div className="relative h-[calc(100vh-65px)] w-full">
        <Image
          src="/hero.jpg"
          alt="Hero image"
          fill
          className="object-cover object-[20%]"
        />
        <div className="absolute h-full w-full bg-black/50"></div>
        <div className="absolute left-0 top-0 h-full w-full p-7 md:px-7 md:py-16 lg:px-20 2xl:px-[10rem] 2xl:py-20">
          <div className="flex h-full w-full flex-col items-start justify-start md:justify-center">
            <div className="mx-4 my-6 max-w-[25rem] sm:m-8 md:m-12 lg:max-w-[37rem]">
              <div className="text-4xl font-bold leading-tight text-white sm:text-5xl">
                The best digital flashcards and study tools
              </div>
              <div className="mt-4 text-white md:text-xl">
                Join over 60 million students using Quizlet’s science-backed
                flashcards, practice tests and expert solutions to improve their
                grades and reach their goals.
              </div>
            </div>
            <Button
              size="large"
              type="primary"
              onClick={() => dispatch("openSignup")}
              className="ml-4 sm:ml-8 md:ml-12"
            >
              Sign up for free
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

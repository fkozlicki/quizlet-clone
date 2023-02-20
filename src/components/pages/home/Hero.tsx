import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <div className="relative">
      <div className="relative h-[720px] w-full">
        <Image
          src="/hero.avif"
          alt="Hero image"
          fill
          className="object-cover "
        />
      </div>
      <div className="absolute top-0 left-0 h-full w-full p-7 md:py-16 md:px-7 lg:px-20 2xl:px-[10rem] 2xl:py-20">
        <div className="flex h-full w-full flex-col items-start justify-start md:justify-center">
          <div className="mx-4 my-6 max-w-[25rem] sm:m-8 md:m-12 lg:max-w-[37rem]">
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
              The best digital flashcards and study tools
            </h1>
            <p className="mt-4 text-white md:text-xl">
              Join over 60 million students using Quizlet’s science-backed
              flashcards, practice tests and expert solutions to improve their
              grades and reach their goals.
            </p>
          </div>
          <button className="ml-4 mb-12 rounded-lg bg-blue-600 px-6 py-3 text-white sm:ml-8  md:ml-12">
            Sign up for free
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;

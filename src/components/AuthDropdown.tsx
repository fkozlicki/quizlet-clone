import { XMarkIcon } from "@heroicons/react/24/solid";
import { signIn } from "next-auth/react";
import Image from "next/image";
import React from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface AuthDropdownProps {
  status: "signup" | "login" | false;
  openSignup: () => void;
  openLogin: () => void;
  close: () => void;
}

const AuthDropdown = ({
  status,
  openSignup,
  openLogin,
  close,
}: AuthDropdownProps) => {
  return (
    <div
      className={`fixed left-0 top-0 flex h-full w-full bg-white transition-transform duration-300 ${
        status === false
          ? "-translate-y-full opacity-0"
          : "z-50 translate-y-0 opacity-100"
      }`}
    >
      <div className="relative hidden flex-[50%] md:block">
        <Image
          src="/login.png"
          alt="login image"
          fill
          className="object-cover"
        />
      </div>
      <div className="relative flex-[50%] overflow-y-scroll p-4 xl:px-20 xl:py-12">
        <div className="mx-6 lg:mx-12">
          <div className="mb-12 flex gap-8">
            <h3
              className={`${
                status === "signup"
                  ? "border-b-4 border-yellow-500 text-black"
                  : "text-gray-400"
              } cursor-pointer text-2xl font-bold`}
              onClick={openSignup}
            >
              Sign up
            </h3>
            <h3
              className={`${
                status === "login"
                  ? "border-b-4 border-yellow-500 text-black"
                  : "text-gray-400"
              } cursor-pointer text-2xl font-bold`}
              onClick={openLogin}
            >
              Log in
            </h3>
          </div>
          {status === "login" && (
            <div className="mb-8 flex flex-col gap-4">
              <button
                onClick={() => signIn("google")}
                className="relative rounded border-2 p-6 text-lg font-bold"
              >
                <Image
                  src="/google.png"
                  alt=""
                  width={32}
                  height={32}
                  className="absolute top-1/2 -translate-y-1/2"
                />
                Log in with Google
              </button>
              <button
                onClick={() => signIn("facebook")}
                className="relative rounded border-2 p-6 text-lg font-bold"
              >
                <Image
                  src="/facebook.png"
                  alt=""
                  width={25}
                  height={25}
                  className="absolute top-1/2 -translate-y-1/2"
                />
                Log in with Facebook
              </button>
              {/* <button className="relative rounded border-2 p-6 text-lg font-bold">
                <Image
                  src="/apple.png"
                  alt=""
                  width={25}
                  height={25}
                  className="absolute top-1/2 -translate-y-1/2"
                />
                Log in with Apple
              </button> */}
            </div>
          )}
          {status === "signup" && (
            <>
              <div className="mb-8 flex flex-col gap-4">
                <button
                  onClick={() => signIn("google")}
                  className="relative flex items-center justify-center gap-2 rounded-lg border border-gray-300 py-5 px-8 font-semibold text-gray-500 hover:bg-gray-100"
                >
                  <Image src="/google.png" alt="" width={25} height={25} />
                  Continue with Google
                </button>
                <button
                  onClick={() => signIn("facebook")}
                  className="relative flex items-center justify-center gap-2 rounded-lg border border-gray-300  py-5 px-8 font-semibold text-gray-500 hover:bg-gray-100"
                >
                  <Image src="/facebook.png" alt="" width={25} height={25} />
                  Continue with Facebook
                </button>
              </div>
              <div className="flex items-center">
                <div className="h-[2px] flex-1 bg-slate-300"></div>
                <div className="px-5 text-xs font-semibold tracking-wider text-slate-400">
                  OR EMAIL
                </div>
                <div className="h-[2px] flex-1 bg-slate-300"></div>
              </div>
            </>
          )}

          {status === "login" && <LoginForm />}
          {status === "signup" && <SignupForm />}
        </div>
      </div>
      <button onClick={close} className="absolute right-4 top-4 h-6 w-6">
        <XMarkIcon width={24} />
      </button>
    </div>
  );
};

export default AuthDropdown;

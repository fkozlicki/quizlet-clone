import React from "react";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  PlusIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import { useAuthFormContext } from "../contexts/AuthFormContext";
import { useSession } from "next-auth/react";
import Image from "next/image";

const Navbar = () => {
  const { data: session } = useSession();
  const [, dispatch] = useAuthFormContext();

  const openLogin = () => {
    dispatch("openLogin");
  };
  const openSignup = () => {
    dispatch("openSignup");
  };

  return (
    <div className="sticky top-0 z-[100] bg-white">
      <div className="h-12 px-4 md:h-16">
        <div className="flex h-full justify-between">
          <div className="flex">
            <div className="hidden h-full px-2 leading-[4rem] md:block">
              Flash.it
            </div>
            <div className="hidden h-full md:flex">
              <div className="mx-3 hidden h-full leading-[4rem] lg:block">
                Home
              </div>
              <div className="mx-3 h-full leading-[4rem]">Subject areas</div>
              <div className="mx-3 h-full leading-[4rem]">Expert solutions</div>
            </div>
            <div className="hidden items-center px-2 md:flex">
              <div className="flex gap-2 rounded bg-blue-600 px-3 py-[6px] font-medium text-white hover:bg-blue-700">
                <span className="hidden lg:block">Create</span>
                <ChevronDownIcon width={20} className="hidden lg:block" />
                <PlusIcon width={20} className="lg:hidden" />
              </div>
            </div>
            <button className="md:hidden">
              <Bars3Icon width={32} height={32} />
            </button>
          </div>
          <div className="flex items-center">
            <div className="flex h-full items-center px-2">
              <div className="hidden max-w-[15rem] items-center gap-2 rounded-md border border-gray-200 bg-indigo-50 px-2 py-1 lg:flex">
                <MagnifyingGlassIcon className="h-5 w-5" />
                <input
                  type="text"
                  placeholder="Study sets, textbooks, questions"
                  className="hidden flex-1 text-ellipsis bg-transparent pr-9 outline-none placeholder:text-base placeholder:font-medium placeholder:tracking-wider placeholder:text-black md:block"
                />
              </div>
              <button className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-400 hover:border-slate-500 hover:text-slate-500 lg:hidden">
                <MagnifyingGlassIcon className="h-4 w-4" />
              </button>
            </div>
            {!session && (
              <>
                <div className="px-6">
                  <button
                    onClick={openLogin}
                    className="rounded px-2 py-1 hover:bg-indigo-50"
                  >
                    Log in
                  </button>
                </div>
                <button
                  onClick={openSignup}
                  className="rounded bg-amber-400 py-1 px-2 hover:bg-amber-300"
                >
                  <span>Sign up</span>
                </button>
              </>
            )}
            {session && session.user && (
              <div>
                <button className="flex items-center">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="profile image"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-slate-500">
                      {session.user.name ? session.user.name.charAt(0) : "?"}
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

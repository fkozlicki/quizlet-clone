"use client";

import { useAuthDropdownContext } from "@/contexts/AuthDropdownContext";
import { Button } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const HomeCta = () => {
  const router = useRouter();
  const [, dispatch] = useAuthDropdownContext();
  const { data: session } = useSession();

  const getStarted = () => {
    session ? router.push("/latest") : dispatch("openSignup");
  };

  return (
    <div className="mb-12 flex justify-center gap-2">
      <Button onClick={getStarted} type="primary" size="large">
        Get started
      </Button>
      <a
        href="https://github.com/fkozlicki/quizlet-clone"
        target="_blank"
        rel="noreferrer"
      >
        <Button color="bg-primary" size="large">
          Github
        </Button>
      </a>
    </div>
  );
};

export default HomeCta;

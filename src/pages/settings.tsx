import type { User } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import React from "react";
import DeleteAccount from "../components/pages/settings/DeleteAccount";
import NightMode from "../components/pages/settings/NightMode";
import EditProfilePicture from "../components/pages/settings/EditProfilePicture";
import { NextSeo } from "next-seo";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const user = await prisma?.user.findUnique({
    where: {
      id: session.user?.id,
    },
  });

  return {
    props: {
      user,
    },
  };
};

const Settings: NextPage<{ user: User }> = ({ user }) => {
  return (
    <>
      <NextSeo title="Quizlet 2.0 - Settings" />
      <div className="bg-slate-100">
        <div className="mx-4 max-w-screen-lg py-12 sm:mx-6 lg:m-auto">
          <EditProfilePicture image={user.image} userName={user.name} />
          <NightMode />
          <DeleteAccount userName={user.name} image={user.image} />
        </div>
      </div>
    </>
  );
};

export default Settings;

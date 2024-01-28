import type { User } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import React from "react";

import { NextSeo } from "next-seo";
import { prisma } from "../server/db";
import EditProfilePicture from "../components/settings/EditProfilePicture";
import NightMode from "../components/settings/NightMode";
import DeleteAccount from "../components/settings/DeleteAccount";

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

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)) as User,
      session,
    },
  };
};

const Settings: NextPage<{ user: User }> = ({ user }) => {
  return (
    <>
      <NextSeo title="Quizlet 2.0 - Settings" />
      <EditProfilePicture image={user.image} userId={user.id} />
      <NightMode />
      <DeleteAccount userName={user.name} image={user.image} />
    </>
  );
};

export default Settings;

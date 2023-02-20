import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import React from "react";
import ProfileLayout from "../../components/layout/ProfileLayout";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const id = context.query.id as string;

  if (id !== session?.user?.id) {
    return {
      redirect: {
        destination: `/${id}/study-sets`,
        permanent: false,
      },
      props: {
        achivements: false,
      },
    };
  }

  return {
    props: {
      achivements: true,
    },
  };
};

interface StudySetsProps {
  achivements: boolean;
}

const StudySets = ({ achivements }: StudySetsProps) => {
  return (
    <ProfileLayout achivements={achivements}>
      <div>StudySets</div>
    </ProfileLayout>
  );
};

export default StudySets;

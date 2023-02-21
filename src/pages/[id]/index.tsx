import type { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import React from "react";
import ProfileLayout from "../../components/layout/ProfileLayout";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { api } from "../../utils/api";
import { NextSeo } from "next-seo";

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

interface ProfileProps {
  achivements: boolean;
}

const Profile = ({ achivements }: ProfileProps) => {
  const { data: session } = useSession({ required: true });

  const { data } = api.user.getById.useQuery(
    { id: session?.user?.id ?? "" },
    {
      enabled: !!session?.user?.id,
    }
  );

  console.log(data?.sessions);

  return (
    <>
      <NextSeo title="Quizlet 2.0 - Profile" />
      <ProfileLayout achivements={achivements}>
        <div>
          <h2 className="mb-4 text-xl font-bold">Recent activity</h2>
          <div className="grid h-[400px] w-full place-items-center rounded-2xl bg-white p-4 shadow-lg">
            <ReactCalendar
              defaultView="month"
              // formatDay={(locale, date) => console.log(locale, date)}
            />
          </div>
        </div>
      </ProfileLayout>
    </>
  );
};

export default Profile;

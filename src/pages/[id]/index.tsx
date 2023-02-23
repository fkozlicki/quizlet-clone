import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import React from "react";
import ProfileLayout from "../../components/layout/ProfileLayout";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { NextSeo } from "next-seo";
import { api } from "../../utils/api";
import Image from "next/image";

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
  const {
    data: activity,
    isLoading,
    isError,
    error,
  } = api.activity.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>{error.message}</div>;

  return (
    <>
      <NextSeo title="Quizlet 2.0 - Profile" />
      <ProfileLayout achivements={achivements}>
        <div>
          <h2 className="mb-4 text-xl font-bold">Recent activity</h2>
          <div className="grid h-[400px] w-full place-items-center rounded-2xl bg-white p-4 shadow-lg">
            <div>
              <h3 className="mb-4 text-center text-xl font-semibold">
                {new Date().toLocaleString("default", { month: "long" })}
              </h3>
              <ReactCalendar
                defaultView="month"
                view="month"
                showNavigation={false}
                formatShortWeekday={(locale, date) =>
                  new Intl.DateTimeFormat(locale, {
                    weekday: "short",
                  })
                    .format(date)
                    .charAt(0)
                }
                calendarType="Hebrew"
                className="essa"
                tileClassName="relative [&>abbr]:relative [&>abbr]:z-20 [&>abbr]:text-xs [&>abbr]:font-medium hover:bg-transparent w-11 h-11"
                tileContent={({ date }) => {
                  // IF TODAY
                  const today = new Date(
                    new Date().setHours(0, 0, 0, 0)
                  ).toISOString();
                  const stringDate = date.toISOString();
                  if (stringDate === today) {
                    return (
                      <div className="m-auto h-1 w-1 rounded-full bg-black"></div>
                    );
                  }
                  // IF VISITED
                  if (
                    activity.some(
                      ({ date }) => date.toISOString() === stringDate
                    )
                  ) {
                    return (
                      <Image
                        src="/star.svg"
                        alt="streak icon"
                        width={38}
                        height={38}
                        className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2"
                      />
                    );
                  }
                  return <></>;
                }}
              />
            </div>
          </div>
        </div>
      </ProfileLayout>
    </>
  );
};

export default Profile;

import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Image from "next/image";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ProfileLayout from "../../components/layout/ProfileLayout";
import { api } from "../../utils/api";
import type { NextPageWithLayout } from "../_app";
import dayjs from "dayjs";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const id = context.query.id as string;

  if (id !== session?.user?.id) {
    return {
      redirect: {
        destination: `/${id}/study-sets`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const Profile: NextPageWithLayout = () => {
  const {
    data: activity,
    isLoading,
    isError,
    error,
  } = api.activity.getAll.useQuery();
  const today = dayjs().format("YYYY-MM-DD");

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>{error.message}</div>;

  return (
    <>
      <NextSeo title="Quizlet 2.0 - Profile" />
      <h2 className="mb-4 text-xl font-bold">Recent activity</h2>
      <div className="grid h-[400px] w-full place-items-center rounded-2xl bg-white p-4 shadow-lg">
        <div>
          <h3 className="mb-4 text-center text-xl font-semibold">
            {dayjs().format("MMMM")}
          </h3>
          <ReactCalendar
            view="month"
            showNavigation={false}
            formatShortWeekday={(_, date) =>
              dayjs(date).format("ddd").charAt(0)
            }
            calendarType="hebrew"
            tileClassName="relative [&>abbr]:relative [&>abbr]:z-20 [&>abbr]:text-xs [&>abbr]:font-medium hover:bg-transparent w-11 h-11"
            tileContent={({ date }) => {
              const tileDate = dayjs(date).format("YYYY-MM-DD");
              const isToday = tileDate === today;

              if (
                activity.some(
                  ({ date }) => dayjs(date).format("YYYY-MM-DD") === tileDate
                )
              ) {
                return (
                  <>
                    <Image
                      src="/star.svg"
                      alt="streak icon"
                      width={40}
                      height={40}
                      className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2"
                    />
                    {isToday && (
                      <div className="absolute left-1/2 m-auto h-1 w-1 -translate-x-1/2 rounded-full bg-black"></div>
                    )}
                  </>
                );
              }
              if (isToday) {
                return (
                  <div className="absolute left-1/2 m-auto h-1 w-1 -translate-x-1/2 rounded-full bg-black"></div>
                );
              }

              return null;
            }}
          />
        </div>
      </div>
    </>
  );
};

Profile.getLayout = (page) => {
  return <ProfileLayout>{page}</ProfileLayout>;
};

export default Profile;

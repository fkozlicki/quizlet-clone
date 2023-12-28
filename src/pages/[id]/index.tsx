import dayjs from "dayjs";
import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Image from "next/image";
import type { ReactElement } from "react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ProfileLayout from "../../components/layout/ProfileLayout";
import { generateSSGHelper } from "../../server/helpers/ssgHelper";
import { api } from "../../utils/api";
import type { NextPageWithLayout } from "../_app";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssg = generateSSGHelper();
  const session = await getSession(context);
  const userId = context.query?.id;

  if (typeof userId !== "string") {
    throw new Error("No userId");
  }

  await ssg.user.getById.prefetch({ id: userId });

  if (session?.user?.id !== userId) {
    return {
      redirect: {
        destination: `/${userId}/study-sets`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      trpcState: ssg.dehydrate(),
      userId,
    },
  };
};

interface ProfileProps {
  userId: string;
}

const Profile: NextPageWithLayout<ProfileProps> = () => {
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

Profile.getLayout = (page: ReactElement<ProfileProps>) => {
  return <ProfileLayout userId={page.props.userId}>{page}</ProfileLayout>;
};

export default Profile;

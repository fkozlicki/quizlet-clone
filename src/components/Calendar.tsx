"use client";

import { useThemeContext } from "@/contexts/ThemeProvider";
import { type Activity } from "@prisma/client";
import { theme } from "antd";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import Image from "next/image";
import React from "react";
import ReactCalendar from "react-calendar";

const Calendar = ({ activity }: { activity: Activity[] }) => {
  const today = dayjs().format("YYYY-MM-DD");
  const { darkMode } = useThemeContext();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <div
      className="grid h-[400px] w-full place-items-center rounded-2xl"
      style={{
        background: colorBgContainer,
      }}
    >
      <div>
        <Title level={3} className="mb-4 text-center text-xl font-semibold">
          {dayjs().format("MMMM")}
        </Title>
        <ReactCalendar
          view="month"
          showNavigation={false}
          formatShortWeekday={(_, date) => dayjs(date).format("ddd").charAt(0)}
          calendarType="hebrew"
          tileClassName="relative [&>abbr]:relative [&>abbr]:z-20 [&>abbr]:text-xs [&>abbr]:font-medium hover:bg-transparent w-11 h-11"
          className={darkMode ? "text-white" : "text-black"}
          tileContent={({ date }) => {
            const tileDate = dayjs(date).format("YYYY-MM-DD");
            const isToday = tileDate === today;

            if (
              activity.some(
                ({ date }) => dayjs(date).format("YYYY-MM-DD") === tileDate,
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
  );
};

export default Calendar;

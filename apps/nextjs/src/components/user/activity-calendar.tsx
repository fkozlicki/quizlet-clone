"use client";

import React from "react";
import dayjs from "dayjs";
import ReactCalendar from "react-calendar";

import "react-calendar/dist/Calendar.css";
import "./activity-calendar.css";

import { Star } from "lucide-react";

import type { RouterOutputs } from "@acme/api";

interface ActivityCalendarProps {
  activity: RouterOutputs["activity"]["allByUser"];
}

const ActivityCalendar = ({ activity }: ActivityCalendarProps) => {
  const today = dayjs().format("YYYY-MM-DD");

  console.log(today);

  return (
    <div className="rounded-lg bg-background p-2">
      <span className="mb-2 inline-block w-full text-center">
        {dayjs().format("MMMM")}
      </span>
      <ReactCalendar
        view="month"
        showNavigation={false}
        formatShortWeekday={(_, date) => dayjs(date).format("ddd").charAt(0)}
        calendarType="hebrew"
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
                <Star
                  size={40}
                  className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 text-yellow-300"
                />
                {isToday && (
                  <div className="absolute left-1/2 m-auto h-1 w-1 -translate-x-1/2 rounded-full bg-foreground"></div>
                )}
              </>
            );
          }
          if (isToday) {
            return (
              <div className="absolute left-1/2 m-auto h-1 w-1 -translate-x-1/2 rounded-full bg-foreground"></div>
            );
          }

          return null;
        }}
      />
    </div>
  );
};

export default ActivityCalendar;

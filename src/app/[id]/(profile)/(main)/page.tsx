import Calendar from "@/components/Calendar";
import { api } from "@/trpc/server";
import Title from "antd/es/typography/Title";
import { notFound } from "next/navigation";
import "react-calendar/dist/Calendar.css";

export default async function Profile({
  params: { id },
}: {
  params: { id: string };
}) {
  const user = await api.user.getById.query({ id });
  const activity = await api.activity.getAll.query();

  if (!user) {
    notFound();
  }

  return (
    <>
      <Title className="mb-4 text-xl font-bold">Recent activity</Title>
      <Calendar activity={activity} />
    </>
  );
}

import Calendar from "@/components/profile/Calendar";
import { api } from "@/trpc/server";
import Title from "antd/es/typography/Title";

export default async function Profile() {
  const activity = await api.activity.getAll.query();

  return (
    <>
      <Title className="mb-4 text-xl font-bold">Recent activity</Title>
      <Calendar activity={activity} />
    </>
  );
}

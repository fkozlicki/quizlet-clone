import type { Metadata } from "next";

import ActivityCalendar from "~/components/user/activity-calendar";
import { api } from "~/trpc/server";

interface UserOverviewProps {
  params: { id: string };
}

export async function generateMetadata({
  params: { id },
}: UserOverviewProps): Promise<Metadata> {
  const { name } = await api.user.byId({ id });

  return {
    title: name,
  };
}

export default async function UserOverview() {
  const activity = await api.activity.allByUser();

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Your activity</h2>
      <div className="flex items-center justify-center rounded-lg bg-secondary p-4">
        <ActivityCalendar activity={activity} />
      </div>
    </div>
  );
}

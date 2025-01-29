import type { Metadata } from "next";
import { Suspense } from "react";

import { auth } from "@acme/auth";

import StudySetSkeletonGrid from "~/components/shared/study-set-skeleton-grid";
import UserStudySets from "~/components/user/user-study-sets";
import { api } from "~/trpc/server";

interface UserStudySetsProps {
  params: { id: string };
}

export async function generateMetadata({
  params: { id },
}: UserStudySetsProps): Promise<Metadata> {
  const { name } = await api.user.byId({ id });

  return {
    title: `${name}'s study sets`,
  };
}

export default async function Page({ params: { id } }: UserStudySetsProps) {
  const session = await auth();
  const user = await api.user.byId({ id });

  const studySets = api.studySet.allByUser({ userId: id, limit: 6 });

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">
        {session?.user.id === id ? "Your" : `${user.name}'s`} study sets
      </h1>

      <Suspense fallback={<StudySetSkeletonGrid />}>
        <UserStudySets userId={id} promise={studySets} />
      </Suspense>
    </>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { auth } from "@acme/auth";

import StudySetSkeleton from "~/components/shared/study-set-skeleton";
import UserStudySets from "~/components/user/user-study-sets";
import { api } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Quizlet - Latest",
};

export default async function Latest() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const studySets = api.studySet.allByUser({ userId: session.user.id });

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Your study sets</h1>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Suspense
          fallback={
            <>
              <StudySetSkeleton />
              <StudySetSkeleton />
              <StudySetSkeleton />
              <StudySetSkeleton />
            </>
          }
        >
          <UserStudySets userId={session.user.id} promise={studySets} />
        </Suspense>
      </div>
    </>
  );
}

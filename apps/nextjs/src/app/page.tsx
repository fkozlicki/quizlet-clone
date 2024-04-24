import { Suspense } from "react";
import Image from "next/image";

import PopularStudySets from "~/components/popular-study-sets";
import StudySetSkeleton from "~/components/study-set-skeleton";
import { api } from "~/trpc/server";

export default function HomePage() {
  const studySets = api.studySet.popular();

  return (
    <>
      <div className="m-auto mb-12 max-w-4xl lg:mb-24">
        <div className="mb-6 flex w-full justify-center">
          <Image src="/logo.svg" alt="logo" width={220} height={48} />
        </div>
        <h1 className="mb-14 mt-0 text-center text-4xl font-black md:text-5xl lg:text-7xl">
          Modern solution to memorize everything
        </h1>
      </div>
      <h2 className="mb-6 text-2xl font-bold">Popular study sets</h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
          <PopularStudySets promise={studySets} />
        </Suspense>
      </div>
    </>
  );
}

import StudySetPreview from "@/components/shared/StudySetPreview";
import { api } from "@/trpc/server";
import { Button, Empty } from "antd";
import Link from "next/link";
import React from "react";

export default async function ProfileStudySets({
  params: { id },
}: {
  params: { id: string };
}) {
  const studySets = await api.studySet.getAll.query({
    userId: id,
  });

  return (
    <div>
      {studySets.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {studySets.map((set) => (
            <StudySetPreview key={set.id} studySet={set} />
          ))}
        </div>
      ) : (
        <Empty>
          <Link href="/create-set">
            <Button type="primary">Create Now</Button>
          </Link>
        </Empty>
      )}
    </div>
  );
}

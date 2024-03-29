import StudySetPreview from "@/components/shared/StudySetPreview";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { Button, Empty } from "antd";
import Title from "antd/es/typography/Title";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Latest() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/");
  }

  const studySets = await api.studySet.getAll.query({
    userId: session.user.id,
  });

  return (
    <>
      <Title level={2} className="mb-6 text-2xl font-bold">
        Your study sets
      </Title>
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
    </>
  );
}

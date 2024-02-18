import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { api } from "@/trpc/server";
import { Button, Empty } from "antd";
import Image from "next/image";
import StudySetPreview from "@/components/shared/StudySetPreview";
import Title from "antd/es/typography/Title";
import HomeCta from "@/components/HomeCta";

export default async function Home() {
  noStore();
  const sets = await api.studySet.getPopular.query();

  return (
    <div className="relative w-full">
      <div className="m-auto mb-12 max-w-4xl lg:mb-24">
        <div className="mb-6 flex w-full justify-center">
          <Image src="/logo.svg" alt="logo" width={220} height={48} />
        </div>
        <Title className="mb-14 mt-0 text-center text-4xl font-black md:text-5xl lg:text-7xl">
          Modern solution to memorize everything
        </Title>
      </div>
      <HomeCta />
      <Title level={2} className="mb-6 text-2xl font-bold">
        New study sets
      </Title>
      {sets.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {sets.map((set) => (
            <StudySetPreview
              key={set.id}
              authorImage={set.user.image}
              authorName={set.user.name}
              title={set.title}
              termsCount={set.cards.length}
              id={set.id}
              authorId={set.user.id}
            />
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

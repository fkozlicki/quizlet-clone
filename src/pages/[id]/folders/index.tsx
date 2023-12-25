import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import FolderPreview from "../../../components/FolderPreview";
import ProfileLayout from "../../../components/layout/ProfileLayout";
import { api } from "../../../utils/api";
import type { NextPageWithLayout } from "../../_app";

const Folders: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const { query } = useRouter();
  const userId = query.id as string;

  const {
    data: folders,
    isError,
    isLoading,
    error,
  } = api.folder.getAll.useQuery(
    {
      userId,
    },
    {
      enabled: !!userId,
    }
  );

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>{error.message}</div>;

  return (
    <>
      <NextSeo title="Quizlet 2.0 - Folders" />
      {folders.length > 0 ? (
        <div className="grid gap-y-4">
          {folders.map(({ title, slug, studySets }, index) => (
            <FolderPreview
              key={index}
              title={title}
              setsCount={studySets.length}
              href={`/${userId}/folders/${slug}`}
            />
          ))}
        </div>
      ) : (
        <>
          {session ? (
            <div>You have no folders</div>
          ) : (
            <div>User have no folders</div>
          )}
        </>
      )}
    </>
  );
};

Folders.getLayout = (page) => {
  return <ProfileLayout>{page}</ProfileLayout>;
};

export default Folders;

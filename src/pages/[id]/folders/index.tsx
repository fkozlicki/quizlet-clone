import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import FolderPreview from "../../../components/FolderPreview";
import ProfileLayout from "../../../components/layout/ProfileLayout";
import { api } from "../../../utils/api";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const id = context.query.id as string;

  if (id !== session?.user?.id) {
    return {
      redirect: {
        destination: `/${id}/study-sets`,
        permanent: false,
      },
      props: {
        achivements: false,
      },
    };
  }

  return {
    props: {
      achivements: true,
    },
  };
};

interface FoldersProps {
  achivements: boolean;
}

const Folders = ({ achivements }: FoldersProps) => {
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
    <ProfileLayout achivements={achivements}>
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
    </ProfileLayout>
  );
};

export default Folders;

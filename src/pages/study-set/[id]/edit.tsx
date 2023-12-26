import type { NextPage } from "next";
import { type GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import StudySetForm from "../../../components/StudySetForm";
import { api } from "../../../utils/api";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userId = context.query.id;
  const session = await getSession(context);

  if (!session || session.user.id !== userId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

const Edit: NextPage = () => {
  const { query } = useRouter();
  const {
    data: studySet,
    isLoading,
    isError,
  } = api.studySet.getById.useQuery(
    { id: query.id as string },
    {
      enabled: !!query.id,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading || isError) return <div>Loading...</div>;

  return (
    <>
      <NextSeo title="Quizlet 2.0 - Edit study set" />
      {studySet && <StudySetForm initialData={studySet} />}
    </>
  );
};

export default Edit;

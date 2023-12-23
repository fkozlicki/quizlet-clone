import type { NextPage } from "next";
import { type GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import StudySetForm from "../../../components/StudySetForm";
import { api } from "../../../utils/api";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
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
  const { data: studySet, isLoading } = api.studySet.getById.useQuery(
    { id: query.id as string },
    {
      enabled: !!query.id,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <NextSeo title="Quizlet 2.0 - Edit study set" />
      <div className="bg-slate-100">
        <div className="mx-4 max-w-[75rem] pb-4 sm:mx-10 xl:mx-auto">
          {studySet && <StudySetForm initialData={studySet} />}
        </div>
      </div>
    </>
  );
};

export default Edit;

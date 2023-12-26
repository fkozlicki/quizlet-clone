import { type GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import StudySetForm from "../../../components/StudySetForm";
import { generateSSGHelper } from "../../../server/helpers/ssgHelper";
import { api } from "../../../utils/api";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssg = generateSSGHelper();
  const session = await getSession(context);
  const setId = context.query?.id;

  if (typeof setId !== "string") {
    throw new Error("No setId");
  }

  await ssg.studySet.getById.prefetch({ id: setId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      setId,
      session,
    },
  };
};

const Edit = ({ setId }: { setId: string }) => {
  const { data: session } = useSession();
  const { push } = useRouter();
  const { data: studySet } = api.studySet.getById.useQuery({
    id: setId,
  });

  if (!studySet) {
    return <div>404</div>;
  }

  if (studySet.userId !== session?.user.id) {
    void push(`/study-set/${studySet.id}`);
    return null;
  }

  return (
    <>
      <NextSeo title="Quizlet 2.0 - Edit study set" />
      <StudySetForm initialData={studySet} />
    </>
  );
};

export default Edit;

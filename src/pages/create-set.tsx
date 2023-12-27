import { type GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import StudySetForm from "../components/study-set/StudySetForm";

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

const CreateSet = () => {
  return (
    <>
      <NextSeo title="Quizlet 2.0 - Create study set" />
      <StudySetForm />
    </>
  );
};

export default CreateSet;

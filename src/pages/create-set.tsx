import { type GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import StudySetForm from "../components/StudySetForm";

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
      <div className="bg-slate-100 py-10">
        <div className="mx-4 max-w-6xl pb-4 sm:mx-10 xl:mx-auto">
          <StudySetForm />
        </div>
      </div>
    </>
  );
};

export default CreateSet;

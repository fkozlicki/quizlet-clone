import type { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import FlashcardsGame from "../../../components/FlashcardsGame";
import { generateSSGHelper } from "../../../server/helpers/ssgHelper";
import { api } from "../../../utils/api";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssg = generateSSGHelper();
  const setId = context.query?.id;

  if (typeof setId !== "string") {
    throw new Error("No setId");
  }

  await ssg.studySet.getById.prefetch({ id: setId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      setId,
    },
  };
};

const Flashcards = ({ setId }: { setId: string }) => {
  const { data: studySet } = api.studySet.getById.useQuery({
    id: setId,
  });

  if (!studySet) return <div>404</div>;

  return (
    <>
      <NextSeo title="Quizlet 2.0 - Flashcards" />
      <div className="m-auto max-w-5xl">
        <FlashcardsGame
          setId={setId}
          cards={studySet.cards}
          ownerId={studySet.userId}
          size="large"
        />
      </div>
    </>
  );
};

export default Flashcards;

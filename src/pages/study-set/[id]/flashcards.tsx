import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import FlashcardsGame from "../../../components/FlashcardsGame";
import { api } from "../../../utils/api";

const Flashcards = () => {
  const { query } = useRouter();
  const setId = query.id?.toString();
  const {
    data: studySet,
    isLoading,
    error,
  } = api.studySet.getById.useQuery(
    {
      id: setId!,
    },
    {
      enabled: !!setId,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading || !setId) return <div>Loading flashcards...</div>;

  if (error) return <div>{error.message}</div>;

  return (
    <>
      <NextSeo title="Quizlet 2.0 - Flashcards" />
      <FlashcardsGame
        cards={studySet.cards}
        ownerId={studySet.userId}
        variant="large"
      />
    </>
  );
};

export default Flashcards;

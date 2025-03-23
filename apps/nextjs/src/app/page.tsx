import Hero from "~/components/home/hero";
import LatestStudySets from "~/components/home/latest-study-sets";
import PopularStudySets from "~/components/home/popular-study-sets";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PopularStudySets />
      <LatestStudySets />
    </>
  );
}

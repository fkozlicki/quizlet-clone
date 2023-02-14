import React, { useRef, useState, type MouseEvent } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { api } from "../utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import FlippingCardContent from "./FlippingCardContent";

interface FlippingCardProps {
  userId: string;
  id: string;
  term: string;
  definition: string;
  index: number;
  length: number;
  changeCardCallback: (value: number) => void;
  refetchSet: () => void;
  variant: "normal" | "large";
  buttonVariant: "chevron" | "description";
  addToLearning?: () => void;
  addToKnow?: () => void;
}

const editCardSchema = z.object({
  term: z.string(),
  definition: z.string(),
});

type EditCardInputs = z.infer<typeof editCardSchema>;

const FlippingCard = ({
  id,
  userId,
  term,
  definition,
  index,
  length,
  changeCardCallback,
  refetchSet,
  variant,
  buttonVariant,
  addToLearning,
  addToKnow,
}: FlippingCardProps) => {
  const [animation, setAnimation] = useState<"flipIn" | "flipOut" | false>(
    false
  );
  const { data: session } = useSession();
  const isEditable = !!session && session.user?.id === userId;
  const updateCard = api.card.edit.useMutation({
    onSuccess: () => {
      refetchSet();
      toast("Edited card successfuly", {
        icon: "✅",
      });
    },
    onError: () => {
      toast("Couldn't edit card", {
        icon: "❌",
      });
    },
  });
  const { register, handleSubmit } = useForm<EditCardInputs>({
    resolver: zodResolver(editCardSchema),
    defaultValues: {
      definition,
      term,
    },
  });
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [animationCard, setAnimationCard] = useState<"learning" | "know">(
    "know"
  );
  const cardWrapper = useRef<HTMLDivElement>(null);
  const animationCardWrapper = useRef<HTMLDivElement>(null);

  const animateScoreCard = (variant: "learning" | "know") => {
    const { current } = animationCardWrapper;
    if (!current) return;

    const animationName =
      variant === "learning" ? "animate-learning" : "animate-know";

    current.classList.remove("animate-learning", "animate-know");
    // -> triggering animation reflow
    void current.offsetWidth;

    current.classList.add(animationName);
  };

  const animateSlide = (variant: "left" | "right") => {
    const { current } = cardWrapper;
    if (!current) return;

    const animationName =
      variant === "left" ? "animate-slideLeft" : "animate-slideRight";

    current.classList.remove("animate-slideLeft", "animate-slideRight");
    // -> triggering animation reflow
    void current.offsetWidth;

    current.classList.add(animationName);
  };

  const editCard = (data: EditCardInputs) => {
    updateCard.mutate({ id, ...data });
    setEditOpen(false);
  };

  const closeEditing = () => {
    setEditOpen(false);
  };

  const openEditing = (e: MouseEvent) => {
    e.stopPropagation();
    setEditOpen(true);
  };

  const leftButtonCallback = (e: MouseEvent) => {
    e.stopPropagation();
    addToLearning && addToLearning();
    changeCardCallback(buttonVariant === "chevron" ? -1 : 1);
    setAnimationCard("learning");
    // animate
    buttonVariant === "chevron"
      ? animateSlide("left")
      : animateScoreCard("learning");
  };

  const rightButtonCallback = (e: MouseEvent) => {
    e.stopPropagation();
    addToKnow && addToKnow();
    changeCardCallback(1);
    setAnimationCard("know");
    // animate
    buttonVariant === "chevron"
      ? animateSlide("right")
      : animateScoreCard("know");
  };

  const toggleFlip = () => {
    setAnimation((prev) =>
      prev === false || prev === "flipOut" ? "flipIn" : "flipOut"
    );
  };

  return (
    <div className="relative flex">
      {buttonVariant === "description" && (
        <div
          ref={animationCardWrapper}
          className={`invisible absolute top-0 left-0 z-20 flex h-full w-full items-center justify-center rounded-lg border bg-white opacity-0`}
        >
          {animationCard === "know" ? (
            <div className="text-3xl font-bold text-green-400">Know</div>
          ) : (
            <div className="text-3xl font-bold text-orange-600">
              Still learning
            </div>
          )}
        </div>
      )}

      <div
        className={`w-full ${
          variant === "normal"
            ? "min-h-[21rem] sm:min-h-[25rem]"
            : "min-h-[40rem]"
        }`}
      >
        <div
          ref={cardWrapper}
          className={`group h-full w-full [perspective:1000px]`}
        >
          <div
            onClick={toggleFlip}
            className={`relative h-full w-full cursor-pointer [transform-style:preserve-3d] [animation-fill-mode:forwards] ${
              animation === "flipIn"
                ? "animate-flipIn"
                : animation === "flipOut"
                ? "animate-flipOut"
                : ""
            } `}
          >
            <div className="absolute h-full w-full [backface-visibility:hidden]">
              <div className="h-full w-full rounded-lg bg-white p-4 drop-shadow-lg md:p-6">
                <FlippingCardContent
                  index={index}
                  openEditing={openEditing}
                  title="Term"
                  content={term}
                  isEditable={isEditable}
                  count={length}
                  leftButtonCallback={leftButtonCallback}
                  rightButtonCallback={rightButtonCallback}
                  buttonVariant={buttonVariant}
                />
              </div>
            </div>
            <div className="absolute h-full w-full [backface-visibility:hidden] [transform:rotateX(180deg)]">
              <div className="h-full w-full rounded-lg bg-white p-4 drop-shadow-lg  md:p-6">
                <FlippingCardContent
                  index={index}
                  openEditing={openEditing}
                  title="Definition"
                  content={definition}
                  isEditable={isEditable}
                  count={length}
                  leftButtonCallback={leftButtonCallback}
                  rightButtonCallback={rightButtonCallback}
                  buttonVariant={buttonVariant}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`fixed top-0 left-0 z-30 h-screen w-screen items-center justify-center bg-black/20 ${
          editOpen ? "flex" : "hidden"
        }`}
      >
        <div className="relative w-3/4 max-w-[700px] rounded-xl bg-white px-4 py-6 sm:px-8 sm:py-12">
          <button onClick={closeEditing} className="absolute top-4 right-4">
            <XMarkIcon width={30} height={30} />
          </button>
          <h1 className="mb-6 text-3xl font-semibold">Edit</h1>
          <form onSubmit={handleSubmit(editCard)}>
            <div className="mb-6 flex flex-col gap-6">
              <label>
                <input
                  type="text"
                  {...register("term")}
                  className="w-full border-b-2"
                />
              </label>
              <label>
                <input
                  type="text"
                  {...register("definition")}
                  className="w-full border-b-2"
                />
              </label>
            </div>
            <div className="flex justify-end gap-6">
              <button
                type="button"
                onClick={closeEditing}
                className="rounded-lg px-4 py-2 font-medium text-blue-600 hover:bg-blue-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FlippingCard;

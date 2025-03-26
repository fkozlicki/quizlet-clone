import { motion } from "framer-motion";

import { useMatchModeContext } from "~/contexts/match-mode-context";

interface MemoryCardProps {
  index: number;
  content: string;
}

const MemoryCard = ({ index, content }: MemoryCardProps) => {
  const { selectCard, selected, matched, mismatched } = useMatchModeContext();

  const isSelected = selected.includes(index);
  const isMatched = matched.includes(index);
  const isMismatched = mismatched.includes(index);

  const variants = {
    selected: {
      background: "#bfdbfe",
      borderColor: "#2563eb",
    },
    matched: {
      background: "#bbf7d0",
      borderColor: "#16a34a",
      scale: 0,
      transition: {
        scale: {
          duration: 0.2,
          ease: "linear",
        },
      },
    },
    mismatch: {
      background: "#fda4af",
      borderColor: "#e11d48",
      rotate: [-2, 0, -2, 0, -2, 0],
      transition: {
        rotate: {
          duration: 0.2,
        },
      },
    },
  };

  const animation = isSelected
    ? "selected"
    : isMatched
      ? "matched"
      : isMismatched
        ? "mismatch"
        : undefined;

  return (
    <motion.div
      variants={variants}
      animate={animation}
      onClick={() => selectCard(index)}
      className="cursor-pointer rounded-xl border-2 shadow"
    >
      <div className="flex min-h-[10rem] items-center justify-center p-4">
        <span className="font-medium">{content}</span>
      </div>
    </motion.div>
  );
};

export default MemoryCard;

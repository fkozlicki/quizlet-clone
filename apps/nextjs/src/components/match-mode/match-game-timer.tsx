"use client";

import { useEffect, useRef, useState } from "react";

import { useMatchModeContext } from "~/contexts/match-mode-context";

const MatchGameTimer = () => {
  const { setEllapsedTime } = useMatchModeContext();
  const [timer, setTimer] = useState<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        timeRef.current = prev + 0.1;
        return prev + 0.1;
      });
    }, 100);

    return () => {
      clearInterval(interval);
      setEllapsedTime(timeRef.current);
    };
  }, []);

  return (
    <span className="mb-4 inline-block text-xl tabular-nums">
      {timer.toFixed(1)} sec.
    </span>
  );
};

export default MatchGameTimer;

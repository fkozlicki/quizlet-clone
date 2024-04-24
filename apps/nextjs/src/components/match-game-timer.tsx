import React, { useEffect, useRef, useState } from "react";

interface MatchGameTimerProps {
  updateEllapsedTime: (time: number) => void;
}

const MatchGameTimer = ({ updateEllapsedTime }: MatchGameTimerProps) => {
  const [ellapsedTime, setEllapsedTime] = useState<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setEllapsedTime((prev) => {
        timeRef.current = prev + 0.1;
        return prev + 0.1;
      });
    }, 100);

    return () => {
      clearInterval(interval);
      updateEllapsedTime(timeRef.current);
    };
  }, []);

  return (
    <span className="mb-4 inline-block text-xl tabular-nums">
      {ellapsedTime.toFixed(1)} sec.
    </span>
  );
};

export default MatchGameTimer;

"use client";

import useJoin from "@/hooks/useJoin";
import { cn } from "@/lib/utils";
import { Users2 } from "lucide-react";
import { type EventHandler, type MouseEvent, useEffect, useState } from "react";

type JoinButtonProps = {
  initialJoins: number;
  initialJoined?: boolean;
  eventId: number;
  username?: string;
  size: number;
};

export default function JoinButton({
  initialJoins,
  initialJoined,
  eventId,
  username,
  size,
}: JoinButtonProps) {
  const [joined, setJoined] = useState(initialJoined);
  const [joinsCount, setJoinsCount] = useState(initialJoins);
  const { joinEvent, unjoinEvent, loading } = useJoin();

  useEffect(() => {
    setJoined(initialJoined);
    setJoinsCount(initialJoins);
  }, [initialJoined, initialJoins]);

  const handleClick: EventHandler<MouseEvent> = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if(!username) return;
    if(joined) {
      await unjoinEvent({
        eventId,
        joinerName: username,
      });
      setJoinsCount((prev) => prev - 1);
      setJoined(false);
    } else {
      await joinEvent({
        eventId,
        joinerName: username,
      });
      setJoinsCount((prev) => prev + 1);
      setJoined(true);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={cn(joined && "text-[#2ECC71]", "ml-auto mr-3 px-3 my-auto py-1 bg-opacity-50 text-center font-mono text-xs rounded-full hover:bg-gray-100 transition")}
    >
      <Users2
        fill={joined? "#2ECC71" : "white"}
        size={size}
      />
      {joinsCount}
    </button>
  );
}
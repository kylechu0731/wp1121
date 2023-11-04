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
};

export default function BigJoinButton({
  initialJoins,
  initialJoined,
  eventId,
  username,
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
    <>
      <button
        onClick={handleClick}
        disabled={loading}
        className="p-0"
      >
        <div className="flex gap-1 p-2 ml-4 rounded-full hover:bg-gray-100">
          <div className={cn("text-white rounded-full px-[6px] pt-1",
                        joined? "bg-[#06c258]":"bg-black")}>
            <Users2 size={25} />
          </div>
          <div className="flex flex-col">
            <text className="text-sm -mb-2 font-bold">
              click to {joined? "quit":"join"}
            </text>
          <text className="-ml-3">
            {joinsCount} joiners
          </text>
          </div>
        </div>
      </button>
    </>
  );
}
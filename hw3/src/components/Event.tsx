// "use client"

import Link from "next/link";
import TimeText from "./TimeText";
import { cn } from "@/lib/utils";
import UserName from "./UserName";
import JoinButton from "./JoinButton";

type EventProps = {
  username?: string,
  id: number,
  hostName: string,
  eventName: string,
  startDate: Date,
  endDate: Date,
  startHour: number,
  endHour: number,
  joiners: number,
  joined?: boolean,
};

export default function Event({
  username,
  id,
  hostName,
  eventName,
  startDate,
  endDate,
  startHour,
  endHour,
  joiners,
  joined,
}: EventProps) {
  // const { cancelEvent } = useEvent();

  // const handleCancel = async () => {
  //   try {
  //     await cancelEvent(id);
  //   } catch(error) {
  //     console.log(error);
  //     alert(error);
  //   }
  // }

  return (
    <>
      <Link
        href={{
          pathname: `/event/${id}`,
          query: { username },
        }}
      >
        <div className="flex mx-3 mb-3 pt-1 border-opacity-50 border-[1px] border-gray-200 rounded-lg shadow-[rgba(0,_0,_0,_0.2)_1px_3px_6px] hover:shadow-[rgba(0,_0,_0,_0.4)_1px_5px_8px] transition">
            <article className="flex ml-3 flex-col w-full">
              <div className="text-xs pt-1 flex">
                <UserName
                  className="gap-[2px]"
                  className2="text-[22px]"
                  username={hostName}
                />
                <time className="ml-2">
                  {startHour}:00{" · "}
                  <TimeText date={startDate} format="D MMM YYYY" />
                  {" "}-{" "}
                  {endHour}:00{" · "}
                  <TimeText date={endDate} format="D MMM YYYY" />
                </time>
              </div>
              <div className={cn("ml-1 text-xl pb-6 mt-2 font-bold")}>
                {eventName}
              </div>
            </article>
            <JoinButton
              initialJoins={joiners}
              initialJoined={joined}
              eventId={id}
              username={username}
              size={24}
            />
        </div>
      </Link>
      {/* <button onClick={handleCancel}>delete</button> */}
    </>
  );
}
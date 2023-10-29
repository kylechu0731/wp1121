import Link from "next/link";
import { Separator } from "./ui/separator";
import TimeText from "./TimeText";

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
  createdAt: Date,
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
  createdAt,
}: EventProps) {
  return (
    <>
      <Link
        href={{
          pathname: `/`,
          query: { username }
        }}
      >
        <div className="flex mx-3 mb-3 pt-1 border-opacity-50 border-[1px] border-gray-200 rounded-lg shadow-[rgba(0,_0,_0,_0.2)_1px_6px_6px] hover:shadow-[rgba(0,_0,_0,_0.4)_1px_6px_8px] transition">
            <article className="flex ml-3 flex-col">
              <p className="text-xs pt-1">
                @{hostName}
                <time className="ml-2">
                  {startHour}:00{" · "}
                  <TimeText date={startDate} format="D MMM YYYY" />
                  {" "}-{" "}
                  {endHour}:00{" · "}
                  <TimeText date={endDate} format="D MMM YYYY" />
                </time>
              </p>
              <article className="ml-3 text-xl pb-6 mt-3 font-bold">
                {eventName}
              </article>
            </article>
        </div>
      </Link>
    </>
  );
}
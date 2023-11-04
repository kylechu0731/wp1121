import BigJoinButton from "@/components/BigJoinButton";
import Comment from "@/components/Comment";
import CommentBar from "@/components/CommentBar";
import HomePageButton from "@/components/HomePageButton";
import TimeText from "@/components/TimeText";
import UserName from "@/components/UserName";
import { db } from "@/db";
import { commentsTable, eventsTable, joinsTable } from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { CalendarDays, CalendarRange } from "lucide-react";
import { redirect } from "next/navigation";

type EventPageProps = {
  params: {
    event_id: string;
  };
  searchParams: {
    username?: string;
  };
};

export default async function EventPage({
  params: { event_id },
  searchParams: { username },
}: EventPageProps) {
  const errorRedirect = () => {
    const params = new URLSearchParams();
    username && params.set("username", username);
    redirect(`/?${params.toString()}`);
  }

  const event_id_num = parseInt(event_id);
  if(isNaN(event_id_num)) errorRedirect();

  const [eventData] = await db
    .select({
      id: eventsTable.id,
      eventname: eventsTable.eventName,
      hostname: eventsTable.hostName,
      startdate: eventsTable.startDate,
      enddate: eventsTable.endDate,
      starthour: eventsTable.startHour,
      endhour: eventsTable.endHour,
      createdAt: eventsTable.createdAt,
    })
    .from(eventsTable)
    .where(eq(eventsTable.id, event_id_num))
    .execute()

    const joins = await db
      .select({
        id: joinsTable.id,
      })
      .from(joinsTable)
      .where(eq(joinsTable.eventId, event_id_num))
      .execute()

    const numJoins = joins.length;

    const [joined] = await db
      .select({
        id: joinsTable.id,
      })
      .from(joinsTable)
      .where(
        and(
          eq(joinsTable.eventId, event_id_num),
          eq(joinsTable.joinerName, username ?? "")
        ),
      )
      .execute();

    const event = {
      id: eventData.id,
      eventname: eventData.eventname,
      hostname: eventData.hostname,
      createdAt: eventData.createdAt,
      startdate: eventData.startdate,
      enddate: eventData.enddate,
      starthour: eventData.starthour,
      endhour: eventData.endhour,
      joins: numJoins,
      joined: Boolean(joined),
    };

    const comments = await db
      .select({
        id: commentsTable.id,
        commenterName: commentsTable.commenterName,
        content: commentsTable.content,
        createdAt: commentsTable.createdAt,
      })
      .from(commentsTable)
      .where(eq(commentsTable.eventId, event_id_num))
      .orderBy(asc(commentsTable.createdAt))
      .execute();

  return (
    <>
      <HomePageButton username={username ?? ""} />
      <div className="mt-5 ml-5 text-3xl font-bold">
        {event.eventname}
      </div>
      <div className="mt-1 ml-5 flex">
        launched by
        <UserName
          className="ml-1 mr-2 -mt-1"
          className2="text-[22px]"
          username={event.hostname ?? ""}
        />
        at{" "}
        <TimeText date={new Date(event.createdAt ?? "")} format="h:mm A · D MMM YYYY"/>
      </div>
      <div className="flex gap-4">
        <div className="flex gap-1 p-2 ml-4 rounded-full cursor-default hover:bg-gray-100">
          <div className="bg-black text-white rounded-full px-[6px] pt-1">
            <CalendarDays size={25} />
          </div>
          <div className="flex flex-col">
          <text className="text-sm -mb-2 font-bold">start</text> 
          <TimeText date={new Date(event.startdate ?? "")} format="D MMM YYYY" />
          {" "}{event.starthour}h
          </div>
        </div>
        <div className="flex gap-1 p-2 ml-4 rounded-full cursor-default hover:bg-gray-100">
          <div className="bg-black text-white rounded-full px-[6px] pt-1">
            <CalendarRange size={25} />
          </div>
          <div className="flex flex-col">
          <text className="text-sm -mb-2 font-bold">end</text> 
          <TimeText date={new Date(event.enddate ?? "")} format="D MMM YYYY" />
          {" "}{event.endhour}h
          </div>
        </div>
        <BigJoinButton
          initialJoins={event.joins}
          initialJoined={event.joined}
          eventId={event.id}
          username={username}
        />
      </div>
        <CommentBar 
          joined={event.joined}
          username={username ?? ""}
          eventId={event.id}
        />
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          commenterName={comment.commenterName}
          content={comment.content}
          createdAt={comment.createdAt}
        />
      ))}
    </>
  )
}
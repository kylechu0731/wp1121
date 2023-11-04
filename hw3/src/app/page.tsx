import EventRegion from "@/components/EventRegion";
import HeaderBar from "@/components/HeaderBar";
import NameDialog from "@/components/NameDialog";
import { db } from "@/db";
import { eventsTable, joinsTable, usersTable } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

type HomeProps = {
  searchParams: {
    username?: string;
  };
};

export default async function Home({
  searchParams: { username },
}: HomeProps) {

  if(username) {
    await db
      .insert(usersTable)
      .values({ userName: username })
      .onConflictDoNothing()
      .execute();
  }

  const joinsSubquery = db.$with("joins_count").as(
    db
      .select({
        eventId: joinsTable.eventId,
        joins: sql<number | null>`count(*)`.mapWith(Number).as("joins"),
      })
      .from(joinsTable)
      .groupBy(joinsTable.eventId)
  );

  const joinedSubquery = db.$with("joined").as(
    db
      .select({
        eventID: joinsTable.eventId,
        joined: sql<number>`1`.mapWith(Boolean).as("joined"),
      })
      .from(joinsTable)
      .where(eq(joinsTable.joinerName, username ?? "")),
  );

  const events = await db
    .with(joinsSubquery, joinedSubquery)
    .select({
      id: eventsTable.id,
      eventName: eventsTable.eventName,
      hostName: eventsTable.hostName,
      startDate: eventsTable.startDate,
      endDate: eventsTable.endDate,
      startHour: eventsTable.startHour,
      endHour: eventsTable.endHour,
      joins: joinsSubquery.joins,
      joined: joinedSubquery.joined,
    })
    .from(eventsTable)
    .orderBy(desc(eventsTable.createdAt))
    .leftJoin(joinsSubquery, eq(eventsTable.id, joinsSubquery.eventId))
    .leftJoin(joinedSubquery, eq(eventsTable.id, joinedSubquery.eventID))
    .execute()

  return ( 
    <>
      <main className="mx-auto flex-col">
        <HeaderBar />
        <EventRegion
          events={events}
          username={username ?? ""}
        />
        <NameDialog />
      </main>
    </>
  )
}

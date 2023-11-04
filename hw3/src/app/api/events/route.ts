import { db } from "@/db";
import { eventsTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const postEventReqSchema = z.object({
  eventname: z.string().min(1).max(50),
  hostname: z.string().min(1).max(50),
  startdate: z.string(),
  enddate: z.string(),
  starthour: z.number(),
  endhour: z.number(),
});

const deleteEventReqSchema = z.object({
  eventId: z.number(),
});

type PostEventReq = z.infer<typeof postEventReqSchema>
type DeleteEventReq = z.infer<typeof deleteEventReqSchema>

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    postEventReqSchema.parse(data);
  } catch(error) {
    console.log(data)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { eventname,
          hostname,
          startdate,
          enddate,
          starthour,
          endhour } = data as PostEventReq;

  try {
    await db
      .insert(eventsTable)
      .values({
        eventName: eventname,
        hostName: hostname,
        startDate: startdate,
        endDate: enddate,
        startHour: starthour,
        endHour: endhour
      })
      .execute()
  } catch(error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  try {
    const new_event = await db
      .select({ id: eventsTable.id })
      .from(eventsTable)
      .where(eq(eventsTable.hostName, hostname))
      .orderBy(desc(eventsTable.createdAt))
      .execute()

      return NextResponse.json({ id: new_event[0].id }, { status: 200 });
  } catch(error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const data = await req.json();

  try {
    deleteEventReqSchema.parse(data);
  } catch(error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { eventId } = data as DeleteEventReq;

  try {
    await db
      .delete(eventsTable)
      .where(eq(eventsTable.id, eventId))
      .execute()
  } catch(error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
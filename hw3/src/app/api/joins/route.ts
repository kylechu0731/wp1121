import { db } from "@/db";
import { joinsTable } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const joinEventReqSchema = z.object({
  eventId: z.number().positive(),
  joinerName: z.string().min(1).max(50),
});

type JoinEventReq = z.infer<typeof joinEventReqSchema>;

export async function GET(req: NextRequest) {
  const data = await req.json();

  try {
    joinEventReqSchema.parse(data);
  } catch(error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { eventId, joinerName } = data as JoinEventReq;

  try {
    const [exist] = await db
      .select({ dummy: sql`1` })
      .from(joinsTable)
      .where(
        and(
          eq(joinsTable.eventId, eventId),
          eq(joinsTable.joinerName, joinerName),
        )
      )
      .execute()
      
      return NextResponse.json({ joined: Boolean(exist) }, { status: 200 })
  } catch(error) {
    return NextResponse.json(
      { error: "Something went wrong " },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    joinEventReqSchema.parse(data);
  } catch(error) {
    return NextResponse.json({ error: "Invalid request "}, { status: 400 });
  }

  const { eventId, joinerName } = data as JoinEventReq;

  try {
    await db
      .insert(joinsTable)
      .values({
        eventId,
        joinerName
      })
      .onConflictDoNothing()
      .execute();
  } catch(error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    )
  }

  return new NextResponse("OK", { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const data = await req.json();

  try {
    joinEventReqSchema.parse(data);
  } catch(error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { eventId, joinerName } = data as JoinEventReq;

  try {
    await db
      .delete(joinsTable)
      .where(
        and(
          eq(joinsTable.eventId, eventId),
          eq(joinsTable.joinerName, joinerName),
        ),
      )
      .execute();
  } catch(error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
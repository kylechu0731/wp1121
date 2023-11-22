import { db } from "@/db";
import { roomsTable } from "@/db/schema";
import { and, desc, eq, or } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const RoomReqSchema = z.object({
  viewerId: z.string().min(1).max(50),
  counterId: z.string().min(1).max(50)
});
type RoomReq = z.infer<typeof RoomReqSchema>;

export async function GET(req: NextRequest) {
  const viewerId = req.nextUrl.search.toString().substring(1);
  
  try {
    const rooms = await db
      .select({ 
        id: roomsTable.id,
        viewerId: roomsTable.viewerId,
        counterId: roomsTable.counterId,
        announceId: roomsTable.announceId,
        read: roomsTable.read,
        recentTime: roomsTable.recentTime
      })
      .from(roomsTable)
      .where(eq(roomsTable.viewerId, viewerId))
      .orderBy(desc(roomsTable.recentTime))
      .execute();
    return NextResponse.json({ rooms: rooms }, { status: 200 });
  } catch(error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    RoomReqSchema.parse(data);
  } catch(error) {
    console.log(data);
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }

  const { 
    viewerId,
    counterId } = data as RoomReq;

  try {
    await db
      .insert(roomsTable)
      .values({ 
        viewerId,
        counterId
      })
      .onConflictDoNothing()
      .execute();
  } catch(error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }

  return new NextResponse("OK", { status: 200 });
}

export async function PATCH(req: NextRequest) {
  const data = await req.json();

  try {
    RoomReqSchema.parse(data);
  } catch(error) {
    console.log(data);
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }

  const { 
    viewerId,
    counterId
  } = data as RoomReq;

  try {
    await db
      .update(roomsTable)
      .set({ 
        recentTime: new Date(),
        read: false
       })
      .where(and(eq(roomsTable.viewerId, viewerId), eq(roomsTable.counterId, counterId)))
      .execute();
    await db
      .update(roomsTable)
      .set({ 
        recentTime: new Date(),
        read: true
       })
      .where(and(eq(roomsTable.viewerId, counterId), eq(roomsTable.counterId, viewerId)))
      .execute();
  } catch(error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }

  return new NextResponse("OK", { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const data = await req.json();

  try {
    RoomReqSchema.parse(data);
  } catch(error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { 
    viewerId,
    counterId
   } = data as RoomReq;

  try {
    await db
      .delete(roomsTable)
      .where(
        or(
          and(
            eq(roomsTable.viewerId, viewerId),
            eq(roomsTable.counterId, counterId)
          ),
          and(
            eq(roomsTable.viewerId, counterId),
            eq(roomsTable.counterId, viewerId)
          )
        )
      )
      .execute()
  } catch(error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
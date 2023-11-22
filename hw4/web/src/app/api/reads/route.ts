import { db } from "@/db";
import { roomsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const PatchReadReqSchema = z.object({
  viewerId: z.string().min(1).max(50),
  counterId: z.string().min(1).max(50),
  read: z.boolean()
});
type patchReadReq = z.infer<typeof PatchReadReqSchema>;

export async function GET(req: NextRequest) {
  const user = req.nextUrl.search.toString().substring(1);

  try {
    const reads = await db
      .select({ 
        read: roomsTable.read,
        viewerId: roomsTable.viewerId
      })
      .from(roomsTable)
      .where(eq(roomsTable.counterId, user))
      .execute()
    return NextResponse.json({ reads: reads }, { status: 200 });
  } catch(error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const data = await req.json();

  try {
    PatchReadReqSchema.parse(data);
  } catch(error) {
    console.log(data);
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }

  const { 
    viewerId,
    counterId,
    read
  } = data as patchReadReq;

  try {
    await db
      .update(roomsTable)
      .set({ read })
      .where(
          and(eq(roomsTable.viewerId, viewerId), eq(roomsTable.counterId, counterId))
      )
      .execute();
  } catch(error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }

  return new NextResponse("OK", { status: 200 });
}
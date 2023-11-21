import { db } from "@/db";
import { roomsTable } from "@/db/schema";
import { and, eq, or } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const PatchAnnounceReqSchema = z.object({
  viewerId: z.string().min(1).max(50),
  counterId: z.string().min(1).max(50),
  announceId: z.number()
});
type patchAnnounceReq = z.infer<typeof PatchAnnounceReqSchema>;

export async function PATCH(req: NextRequest) {
  const data = await req.json();

  try {
    PatchAnnounceReqSchema.parse(data);
  } catch(error) {
    console.log(data);
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }

  const { 
    viewerId,
    counterId,
    announceId
  } = data as patchAnnounceReq;

  try {
    await db
      .update(roomsTable)
      .set({ announceId })
      .where(
        or(
          and(
            eq(roomsTable.viewerId, viewerId), eq(roomsTable.counterId, counterId)
          ),
          and(
            eq(roomsTable.viewerId, counterId), eq(roomsTable.counterId, viewerId)
          )
        )
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
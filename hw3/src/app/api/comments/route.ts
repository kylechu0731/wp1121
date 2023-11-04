import { db } from "@/db";
import { commentsTable } from "@/db/schema";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const commentReqSchema = z.object({
  commenterName: z.string().min(1).max(50),
  eventId: z.number().positive(),
  content: z.string().min(1).max(280),
})

type CommmentReq = z.infer<typeof commentReqSchema>;

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    commentReqSchema.parse(data);
  } catch(error) {
    return NextResponse.json({ error: "Invalid request "}, { status: 400 });
  }

  const { commenterName, eventId, content } = data as CommmentReq;

  try {
    await db
      .insert(commentsTable)
      .values({
        commenterName,
        eventId,
        content,
      })
      .execute();
  } catch(error) {
    return NextResponse.json(
      { error: "Something went wrong "},
      { status: 500 },
    )
  }

  return new NextResponse("OK", { status: 200 });
}
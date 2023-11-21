import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const postEventReqSchema = z.object({
  displayId: z.string().min(1).max(50)
});
type PostEventReq = z.infer<typeof postEventReqSchema>;

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    postEventReqSchema.parse(data);
  } catch(error) {
    console.log(data);
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }

  const { displayId } = data as PostEventReq;

  try {
    await db
      .insert(usersTable)
      .values({ displayId })
      .onConflictDoNothing()
      .execute();
  } catch(error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
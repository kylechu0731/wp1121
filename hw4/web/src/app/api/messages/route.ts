import { db } from "@/db";
import { messagesTable } from "@/db/schema";
import { and, asc, eq, or } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const postMessageReqSchema = z.object({
  senderId: z.string().min(1).max(50),
  receiverId: z.string().min(1).max(50),
  content: z.string().min(1).max(280)
});
type PostMessageReq = z.infer<typeof postMessageReqSchema>;

const deleteMessageReqSchema = z.object({
  senderId: z.string().min(1).max(50),
  receiverId: z.string().min(1).max(50)
});
type DeleteMessageReq = z.infer<typeof deleteMessageReqSchema>;

const patchMessageReqSchema = z.object({
  id: z.number(),
  unsendState: z.number()
});
type PatchMessageReq = z.infer<typeof patchMessageReqSchema>;

export async function GET(req: NextRequest) {
  const user = req.nextUrl.search.toString().substring(1);

  try {
    const messages = await db
      .select({
        id: messagesTable.id,
        senderId: messagesTable.senderId,
        receiverId: messagesTable.receiverId,
        content: messagesTable.content,
        unsendState: messagesTable.unsendState,
        sentAt: messagesTable.sentAt
      })
      .from(messagesTable)
      .where(
        or(
          eq(messagesTable.senderId, user),
          eq(messagesTable.receiverId, user)
        )
      )
      .orderBy(asc(messagesTable.sentAt))
      .execute();
      return NextResponse.json({ messages: messages }, { status: 200 });
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
    postMessageReqSchema.parse(data);
  } catch(error) {
    console.log(data);
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }

  const {
    senderId,
    receiverId,
    content
  } = data as PostMessageReq;

  try {
    await db
      .insert(messagesTable)
      .values({
        senderId,
        receiverId,
        content
      })
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
    deleteMessageReqSchema.parse(data);
  } catch(error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { 
    senderId,
    receiverId
   } = data as DeleteMessageReq;

  try {
    await db
      .delete(messagesTable)
      .where(
        or(
          and(
            eq(messagesTable.senderId, senderId),
            eq(messagesTable.receiverId, receiverId)
          ),
          and(
            eq(messagesTable.senderId, receiverId),
            eq(messagesTable.receiverId, senderId)
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

export async function PATCH(req: NextRequest) {
  const data = await req.json();

  try {
    patchMessageReqSchema.parse(data);
  } catch(error) {
    console.log(data);
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }

  const { 
    id,
    unsendState
  } = data as PatchMessageReq;

  try {
    await db
      .update(messagesTable)
      .set({ unsendState })
      .where(eq(messagesTable.id, id))
      .execute();
  } catch(error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }

  return new NextResponse("OK", { status: 200 });
}
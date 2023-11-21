"use client"

import { useContext, useEffect, useState } from "react";
//import NewRoomDialog from "./NewRoomDialog";
import { UserContext } from "@/context/user";
import { RoomContext } from "@/context/room";
import NewRoomDialog from "./NewRoomDialog";
import ChatButton from "./ChatButton";
import { MessageContext } from "@/context/message";
import ChatSearch from "./ChatSearch";
//import type { Room } from "@/package/types/room";
//import ChatRoom from "./ChatRoom";

export default function ChatList() {
  const [dialog, setDialog] = useState(false);
  const [search, setSearch] = useState("");
  const { chatRooms, fetchRooms } = useContext(RoomContext);
  const { user, chatter, setChatter } = useContext(UserContext);
  const { messages } = useContext(MessageContext);

  useEffect(() => {
    fetchRooms();
  }, []);

  const previewMessage = (counterId: string) => {
    const filtered_messages = messages.filter((mess) => mess.senderId === counterId || mess.receiverId === counterId);
    try {
      const recent_message = filtered_messages[filtered_messages.length - 1];
      if(recent_message.content.length < 24) return recent_message.content;
      else return recent_message.content.slice(0, 24) + "..."
    } catch(error) {
      return "";
    }
  }

  const filtered_chatRooms = chatRooms.filter((room) =>
    room.counterId.includes(search)
  )
  const not_found = chatRooms.filter((room) =>
    room.counterId === search
  ).length === 0;

  return (
    <div className="min-w-max flex flex-col gap-4 overflow-auto mb-6">
      <div className="sticky top-0 bg-black pb-1 -mb-1">
        <div className="bg-white text-black text-center">
          Chat List
        </div>
      </div>
      { dialog?
      <NewRoomDialog 
        setDialog={setDialog}
        search={not_found ? search : ""}
        setSearch={setSearch}
      />
      :
      <div
        className="border border-2 text-2xl text-center hover:bg-white hover:text-black"
        onClick={() => setDialog(true)}
      >+ {not_found && search}</div>
      }
      { !dialog && <ChatSearch
        search={search}
        setSearch={setSearch}
      />
      }
      {filtered_chatRooms.map((room) =>
        <ChatButton 
          key={room.id}
          name={room.counterId}
          preview={previewMessage(room.counterId)}
          handleChat={() => setChatter(room.counterId)}
          handleCancel={() => setChatter("")}
        />
      )}

    </div>
  );
}
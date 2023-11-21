"use client"

import { UserContext } from "@/context/user";
import { useContext, useEffect, useState } from "react";
import ChatInput from "./ChatInput";
import { MessageContext } from "@/context/message";
import Message from "./Message";
import { RoomContext } from "@/context/room";

export default function ChatPage() {
  const [selectId, setSelectId] = useState(0);
  const [hover, setHover] = useState(false);
  const { user, chatter } = useContext(UserContext);
  const { messages } = useContext(MessageContext);
  const { chatRooms, setAnnounce } = useContext(RoomContext);

  useEffect(() => setSelectId(0), [chatter]);

  const chatter_empty = chatRooms.filter((room) =>
    room.counterId === chatter
  ).length === 0;

  const filtered_messages = messages.filter((mess) => (
    mess.senderId === chatter || mess.receiverId === chatter
  ));

  const room = chatRooms.find((room) => room.viewerId === user && room.counterId === chatter)

  const announce = messages.find((mess) => mess.id === room?.announceId ?? "")

  return (
    <div 
      className="w-full mr-[3%] flex flex-col overflow-auto"
      onClick={() => setSelectId(0)}
    >
      <div className="sticky top-0 bg-black pb-1">
        <div className="text-center bg-white text-black">
          {chatter_empty ? "..." : "Chat Room with " + chatter}</div>
      </div>
      { announce && (!announce.unsendState || (announce.unsendState === 1 && announce.senderId !== user )) &&
      <div 
        className="sticky self-center w-fit top-10 p-1 bg-black rounded-[4px] cursor-default"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="flex gap-2 w-fit px-2 border-4 border-white rounded-sm">
            <div className="text-red-400">!!!</div>
            {announce.content}
            { hover && 
            <div
              className="ml-1 text-red-400 cursor-pointer hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                setAnnounce(user, chatter, 0);
                setHover(false);
              }}
            >X</div>
            }
        </div>
      </div>
      }
      <div className="flex flex-col">
        <div className="flex flex-col overflow-hidden mt-3 gap-2 min-h-screen">
          {filtered_messages.map((mess) =>
            <Message
              key={mess.id}
              id={mess.id}
              sent={mess.receiverId === chatter}
              content={mess.content}
              selectId={selectId}
              setSelectId={setSelectId}
              unsendState={mess.unsendState}
            />
          )}
        </div>
        <ChatInput />
      </div>
    </div>
  );
}
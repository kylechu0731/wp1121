"use client"

import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { Message } from "@/package/types/message";
import { UserContext } from "./user";
import { type Socket, io } from "socket.io-client";
import { env } from "@/utils/env";

export type MessageContext = {
  sendMessage: (e: Omit<Message, "id" | "unsendState" | "sentAt">) => Promise<void>;
  messages: Message[];
  deleteMessagesInRoom: (senderId: string, viewerId: string) => Promise<void>;
  unsendMessage: (id: number, unsendState: number) => void;
};

export const MessageContext = createContext<MessageContext>({
  sendMessage: async () => {},
  messages: [],
  deleteMessagesInRoom: async () => {},
  unsendMessage: () => {}
});

type Props = {
  children: React.ReactNode;
};

export function MessageProvider({ children }: Props) {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();

  useEffect(() => {
    const initSocket = () => {
      const socket = io(env.NEXT_PUBLIC_SOCKET_URL);
      socket.on("receive_message", () => {
        fetchMessages();
      })
      socket.on("delete_room", (viewerId: string, counterId: string) => {
        setMessages((messages) => messages.filter((mess) =>
          (mess.senderId !== viewerId || mess.receiverId !== counterId) &&
          (mess.senderId !== counterId || mess.receiverId !== viewerId)
        ))
      })
      socket.on("unsend_message", (id: number) => {
        console.log("receive socket message");
        setMessages((messages) => messages.map((mess) => mess.id === id ? {...mess, unsendState: 2} : mess));
      })
      setSocket(socket);
    }
    initSocket();
  }, [])

  useEffect(() => {
    fetchMessages();
  }, [user]);

  const fetchMessages = async () => {
    if(loading) return;
    setLoading(true);
    console.log("4");

    try {
      const res = await fetch(`api/messages?${user}`);
      const data = await res.json();
      if(data?.messages) {
        setMessages(data.messages);
        console.log(data.messages);
      }
    } catch(error) {
      console.log(error);
    }

    router.refresh();
    setLoading(false);
  }
  
  const sendMessage = async ({
    senderId,
    receiverId,
    content
  }: Omit<Message, "id" | "unsendState" | "sentAt">) => {
    if(loading) return;
    setLoading(true);

    if(!socket) {
      alert("No socket! Please retry later.");
      return;
    }

    try {
      const res = await fetch("api/messages", {
        method: "POST",
        body: JSON.stringify({
          senderId,
          receiverId,
          content
        })
      });
      if(res.ok) {
        socket.emit("send_message", {
          senderId,
          receiverId,
          content
        });
        socket.emit("create_room", senderId, receiverId)
      }
    } catch(error) {
      console.log(error);
    }

    router.refresh();
    setLoading(false);
  }

  const deleteMessagesInRoom = async (senderId: string, receiverId: string) => {
    if(loading) return;
    setLoading(true);

    const res = await fetch("api/messages", {
      method: "DELETE",
      body: JSON.stringify({
        senderId,
        receiverId
      })
    });

    if(!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  }

  const unsendMessage = async (id: number, unsendState: number) => {
    if(loading) return;
    setLoading(true);

    if(!socket) {
      alert("No socket! Please try later");
      return;
    }

    try {
      const res = await fetch("api/messages", {
        method: "PATCH",
        body: JSON.stringify({
          id,
          unsendState
        })
      });
      if(res.ok) {
        if(unsendState === 1)
          setMessages(messages.map((mess) => mess.id === id ? {...mess, unsendState: 1} : mess));
        else {
          console.log("emit");
          socket.emit("unsend_message", id);
        }
      }
    } catch(error) {
      console.log(error);
    }

    router.refresh();
    setLoading(false);
  }



  return (
    <MessageContext.Provider value={{
      sendMessage,
      messages,
      deleteMessagesInRoom,
      unsendMessage
    }}>
     {children}
    </MessageContext.Provider>
  );
}


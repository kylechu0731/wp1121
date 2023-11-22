"use client"

import { createContext, useContext, useEffect } from "react";
import useState from "react-usestateref";
import { useRouter } from "next/navigation";
import { UserContext } from "./user";
import type { Room } from "@/package/types/room"
import { type Socket, io } from "socket.io-client";
import { env } from "@/utils/env";
import type { Message } from "@/package/types/message";

export type RoomContext = {
  chatRooms: Room[];
  newRoom: (viewerId: string, counterId: string) => Promise<void>;
  fetchRooms: () => Promise<void>;
  deleteRoom: (viewerId: string, counterId: string) => Promise<void>;
  setAnnounce: (viewerId: string, counterId: string, announceId: number) => Promise<void>;
  setRead: (viewerId: string, counterId: string, read: boolean) => Promise<void>;
  reads: Read[];
};

export const RoomContext = createContext<RoomContext>({
  chatRooms: [],
  newRoom: async () => {},
  fetchRooms: async () => {},
  deleteRoom: async () => {},
  setAnnounce: async () => {},
  setRead: async () => {},
  reads: []
});

type Props = {
  children: React.ReactNode;
};

type Read = {
  read: boolean,
  viewerId: string
};

export function RoomProvider({ children }: Props) {
  const [loading, setLoading] = useState(false);
  const [chatRooms, setChatRooms] = useState<Room[]>([]);
  const [reads, setReads] = useState<Read[]>([]);
  const { user, initialiseChatter, setChatter, is_inRoom } = useContext(UserContext);
  const [socket, setSocket, socketRef] = useState<Socket | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initSocket = () => {
      const socket = io(env.NEXT_PUBLIC_SOCKET_URL);
      socket.on("create_room", (senderId: string, receiverId: string) => {
        newRoom(receiverId, senderId);
      });
      socket.on("receive_message", (newMessage: Message) => {
        updateRoom(newMessage.senderId, newMessage.receiverId).then(fetchRooms)
        .then(() => {
          if(is_inRoom(newMessage.receiverId, newMessage.senderId)) {
            setRead(newMessage.senderId, newMessage.receiverId, true);
          }}
        )
      });
      socket.on("delete_room", () => {
        fetchRooms();
      })
      socket.on("set_announce", (viewerId: string, counterId: string, announceId: number) => {
        setChatRooms((chatRooms) => chatRooms.map((room) => 
          (room.viewerId === counterId && room.counterId === viewerId) ? {...room, announceId: announceId} : room))
      })
      socket.on("read_message", (viewerId: string, counterId: string) => {
        setChatRooms((chatRooms) => chatRooms.map((room) =>
          (room.viewerId === viewerId && room.counterId === counterId) ? {...room, read: true} : room))
      })
      setSocket(socket);
    }
    initSocket();
  }, [])

  const fetchRooms = async () => {
    if(loading) return;
    setLoading(true);

    const res = await fetch(`/api/rooms?${user}`);
    const data = await res.json();

    const read_res = await fetch(`/api/reads?${user}`);
    const read_data = await read_res.json();
    
    if(data.rooms[0]) {
      setChatRooms(data.rooms);
      if(initialiseChatter(data.rooms[0].counterId))
        setRead(data.rooms[0].counterId, user, true);
    } else {
      setChatRooms([]);
      setChatter("a");
    }

    if(read_data.reads[0]) {
      setReads(read_data.reads);
    }

    router.refresh();
    setLoading(false);
  }

  const newRoom = async (viewerId: string, counterId: string) => {
    if(loading) return;
    setLoading(true);

    const res = await fetch("/api/rooms", {
      method: "POST",
      body: JSON.stringify({
        viewerId,
        counterId
      })
    });
    console.log(res);

    if(!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  }

  const updateRoom = async (
    viewerId: string,
    counterId: string
  ) => {
    const res = await fetch("/api/rooms", {
      method: "PATCH",
      body: JSON.stringify({
        viewerId,
        counterId
      })
    });
    
    if(!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
  }

  const deleteRoom = async (viewerId: string, counterId: string) => {
    if(loading) return;
    setLoading(true);

    if(!socket) {
      alert("No socket!");
      return;
    }

    try {
      const res = await fetch("/api/rooms", {
        method: "DELETE",
        body: JSON.stringify({
          viewerId,
          counterId
        })
      });
      if(res.ok) {
        socket.emit("delete_room", viewerId, counterId);
      }
    } catch(error) {
      console.log(error);
    }

    router.refresh();
    setLoading(false);
  }

  const setAnnounce = async (viewerId: string, counterId: string, announceId: number) => {
    if(loading) return;
    setLoading(true);

    if(!socket) {
      alert("No socket!");
      return;
    }

    try {
      const res = await fetch("/api/announces", {
        method: "PATCH",
        body: JSON.stringify({
          viewerId,
          counterId,
          announceId
        })
      });
      if(res.ok) {
        socket.emit("set_announce", viewerId, counterId, announceId);
        setChatRooms((chatRooms) => chatRooms.map((room) => 
          (room.viewerId === viewerId && room.counterId === counterId) ? {...room, announceId: announceId} : room))
        }
    } catch(error) {
      console.log(error);
    }

    router.refresh();
    setLoading(false); 
  }

  const setRead = async (viewerId: string, counterId: string, read: boolean) => {
    if(!socketRef.current) {
      alert("No socket!");
      return;
    }

    try {
      const res = await fetch("/api/reads", {
        method: "PATCH",
        body: JSON.stringify({
          viewerId,
          counterId,
          read
        })
      });
      if(res.ok) {
        socketRef.current.emit("read_message", viewerId, counterId);
        setReads((reads) => reads.map((read) => read.viewerId === viewerId ? {...read, read: true} : read))
      }
    } catch(error) {
      console.log(error);
    }

  }

  return (
    <RoomContext.Provider value={{ 
      chatRooms,
      newRoom,
      fetchRooms,
      deleteRoom,
      setAnnounce,
      setRead,
      reads
     }}>
      {children}
    </RoomContext.Provider>
  );
}
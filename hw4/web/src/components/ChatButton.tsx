import { MessageContext } from "@/context/message";
import { RoomContext } from "@/context/room";
import { UserContext } from "@/context/user";
import { cn } from "@/lib/utils"
import { useContext } from "react";

export default function ChatButton({
  name,
  preview,
  handleChat,
  handleCancel
}: {
  name: string,
  preview: string,
  handleChat: () => void,
  handleCancel: () => void
}) {
  const { user, chatter } = useContext(UserContext);
  const { deleteRoom } = useContext(RoomContext);
  const { deleteMessagesInRoom } = useContext(MessageContext);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if(!user) return;

    try {
      await deleteRoom(user, chatter);
      console.log("delete a room");
    } catch(error) {
      alert("Failed to delete room!");
      console.log(error);
    }

    try {
      await deleteMessagesInRoom(user, chatter);
      console.log("delete messages");
    } catch(error) {
      alert("Failed to delete messages in the room!");
      console.log(error);
    }

  }

  return (
    <div 
      className={cn(chatter === name ? "bg-white text-black" : "", "flex group p-1 hover:bg-white hover:text-black")}
      onClick={chatter === name ? handleCancel : handleChat}
    > 
      <div className="flex flex-col">
        {name}
        <div className={cn(chatter === name ? "text-gray-600" : "text-gray-400", "text-sm group-hover:text-gray-600")}>{preview}</div>
      </div>
      {chatter === name &&
      <button 
        className="ml-auto mr-2 self-center text-xl hover:text-red-500"
        onClick={handleDelete}
      >X</button>
      }
    </div>
  );
}
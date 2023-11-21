import { RoomContext } from "@/context/room";
import { UserContext } from "@/context/user";
import { cn, validateUsername } from "@/lib/utils";
import { useContext, useState } from "react";

export default function NewRoomDialog({
  setDialog,
  search,
  setSearch
}:{
  setDialog: (e: boolean) => void,
  search: string,
  setSearch: (e: string) => void
}) {
  const [id, setId] = useState(search);
  const { user, saveUser } = useContext(UserContext);
  const { fetchRooms, chatRooms, newRoom } = useContext(RoomContext);

  setSearch("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!validateUsername(id)) {
      alert("Invalid ID!");
      return;
    }
    if(user === id) {
      alert("You can't chat with yourself!");
      return;
    }
    if(chatRooms.find((room) => room.counterId === id)) {
      alert("The room already exists!");
      return;
    }

    try {
      await saveUser(id);
      console.log("save a user");
      console.log(id);
    } catch(error) {
      alert("Failed to register an user while creating a room!");
      console.log(error);
    }

    try {
      await newRoom(user, id).then(fetchRooms);
      console.log("save a room");
    } catch(error) {
      alert("Failed to create a new room");
      console.log(error);
    }

    setDialog(false);
  }

  return (
    <>
      <div className="flex">
        <div className="ml-auto"/>
        <div
          className="w-[30px] text-center -mb-4 bg-white text-black cursor-pointer"
          onClick={() => setDialog(false)}
        >X</div>
      </div>
      <form 
        className="border-2 border-white"
        onSubmit={handleSubmit}
      >
        <div className="text-center">- Create a New Room -</div>
        <div className="flex">
          <input
            className="bg-black m-2 outline-none"
            placeholder="Enter ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <button
            type="submit"
            className={cn("m-2 px-1", id && "bg-white text-black")}
            disabled={!id}
          >Enter</button>
        </div>
      </form>
    </>
  );
}
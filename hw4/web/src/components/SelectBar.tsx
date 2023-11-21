import { MessageContext } from "@/context/message";
import { RoomContext } from "@/context/room";
import { UserContext } from "@/context/user";
import { cn } from "@/lib/utils";
import { useContext, useState } from "react";

export default function SelectBar({
  id,
  handleCancel,
  sent
}: {
  id: number,
  handleCancel: () => void,
  sent: boolean
}) {
  const [option, setOption] = useState(false);
  const { unsendMessage } = useContext(MessageContext);
  const { setAnnounce } = useContext(RoomContext);
  const { user, chatter } = useContext(UserContext);

  return (
    <div className={cn("flex flex-col -mt-2 mb-2", sent? "mr-1" : "ml-1")}>
      <div 
        className={cn("text-xl -mb-[9px]", sent? "self-end mr-2 text-white" : "ml-2 text-[#222222]")}
      >▲</div>
      <div className={cn("flex flex-col rounded-sm", sent? "py-2 bg-white" : "py-1 bg-[#222222]")}>
        { sent &&
        ( option ?
        <>
          <button 
          className="px-2 text-red-500 hover:text-white hover:bg-red-500"
          onClick={(e) => {
            e.stopPropagation();
            unsendMessage(id, 2);
            handleCancel();
          }}
          >for everyone</button>
          <button 
            className="px-2 text-red-500 hover:text-white hover:bg-red-500"
            onClick={(e) => {
              e.stopPropagation();
              unsendMessage(id, 1);
              handleCancel();
            }}
          >for yourself</button>
        </>
        :
        <button 
          className="px-2 text-gray-600 hover:text-gray-200 hover:bg-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            setOption(true);
          }}
        >unsend</button>
        )
        } 
        <button 
          className={cn("px-2", sent? "text-gray-600 hover:text-gray-200 hover:bg-gray-600" : "text-gray-300 hover:text-white")}
          onClick={(e) => {
            e.stopPropagation();
            setAnnounce(user, chatter, id);
            handleCancel();
          }}
        >announce</button>
      </div>
    </div>
  );
}